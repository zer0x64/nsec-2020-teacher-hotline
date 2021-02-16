use std::time::{Duration, Instant};

use actix::prelude::*;
use actix_web_actors::ws;

use std::collections::VecDeque;

use log::{info, error};

/// How often heartbeat pings are sent
const HEARTBEAT_INTERVAL: Duration = Duration::from_secs(5);
/// How long before lack of client response causes a timeout
const CLIENT_TIMEOUT: Duration = Duration::from_secs(20);

const MAX_USERS: usize = 20;

#[derive(Clone, Copy, Debug)]
pub enum UserType {
    Student,
    Teacher,
}

#[derive(Message)]
#[rtype(result = "()")]
struct UserMessage(pub String);

#[derive(Message, Debug)]
#[rtype(result = "Result<(), ()>")]
struct Register {
    pub address: Addr<ChatWs>,
    pub user_type: UserType,
}

#[derive(Message)]
#[rtype(result = "()")]
struct Full();

#[derive(Message)]
#[rtype(result = "()")]
struct Pair(pub Addr<ChatWs>);

#[derive(Message)]
#[rtype(result = "()")]
struct Unpair();

#[derive(Message)]
#[rtype(result = "()")]
struct Disconnect {
    pub address: Addr<ChatWs>,
    pub user_type: UserType,
    pub peer: Option<Addr<ChatWs>>,
}

#[derive(Debug)]
pub struct PairingServer {
    teachers: VecDeque<Addr<ChatWs>>,
    students: VecDeque<Addr<ChatWs>>,
}

impl Default for PairingServer {
    fn default() -> Self {
        PairingServer {
            teachers: VecDeque::new(),
            students: VecDeque::new(),
        }
    }
}

impl PairingServer {
    pub fn new() -> Self {
        PairingServer {
            teachers: VecDeque::new(),
            students: VecDeque::new(),
        }
    }
}

impl Actor for PairingServer {
    type Context = Context<Self>;
}

impl Handler<Register> for PairingServer {
    type Result = ResponseActFuture<Self, Result<(), ()>>;

    fn handle(&mut self, msg: Register, _: &mut Context<Self>) -> Self::Result {
        match msg.user_type {
            UserType::Teacher => {
                if self.teachers.len() >= MAX_USERS {
                    msg.address.do_send(Full {});
                    return Box::new(async { Ok(()) }.into_actor(self));
                } else {
                    self.teachers.push_back(msg.address)
                }
            }
            UserType::Student => {
                if self.students.len() >= MAX_USERS {
                    msg.address.do_send(Full {});
                    return Box::new(async { Ok(()) }.into_actor(self));
                } else {
                    self.students.push_back(msg.address)
                }
            }
        }

        info!("Teachers: {:?}", self.teachers);
        info!("Students: {:?}", self.students);

        if self.teachers.len() > 0 && self.students.len() > 0 {
            // Pair
            match (self.students.pop_front(), self.teachers.pop_front()) {
                (Some(student), Some(teacher)) => {
                    student.do_send(Pair(teacher.clone()));
                    teacher.do_send(Pair(student));
                }
                _ => error!("Something bad happened during pairing. Race condition?")
            }
        }

        // Empty future
        Box::new(async { Ok(()) }.into_actor(self))
    }
}

impl Handler<Disconnect> for PairingServer {
    type Result = ();

    fn handle(&mut self, msg: Disconnect, _: &mut Context<Self>) -> Self::Result {
        let addr = msg.address;
        let peer = msg.peer;
        let user_type = msg.user_type;

        if let Some(peer) = peer {
            // If he's pair, unpair it's peer
            peer.do_send(Unpair());
        } else {
            // Else, remove from the waiting list
            let waiting_list = match user_type {
                UserType::Teacher => &mut self.teachers,
                UserType::Student => &mut self.students,
            };

            let index = waiting_list.iter().position(|x| x == &addr);
            if let Some(index) = index {
                waiting_list.remove(index);
            }
        }
    }
}

#[derive(Debug)]
pub struct ChatWs {
    pub user_type: UserType,
    pub peer: Option<Addr<ChatWs>>,
    pub server: Addr<PairingServer>,
    pub heartbeat: Instant,
}

impl Actor for ChatWs {
    type Context = ws::WebsocketContext<Self>;

    fn started(&mut self, ctx: &mut Self::Context) {
        self.hb(ctx);

        let msg = Register {
            address: ctx.address(),
            user_type: self.user_type,
        };

        self.server.do_send(msg);
    }

    fn stopped(&mut self, ctx: &mut Self::Context) {
        self.server.do_send(Disconnect {
            address: ctx.address(),
            user_type: self.user_type,
            peer: self.peer.clone(),
        })
    }
}

impl ChatWs {
    fn hb(&self, ctx: &mut ws::WebsocketContext<Self>) {
        ctx.run_interval(HEARTBEAT_INTERVAL, |act, ctx| {
            if Instant::now().duration_since(act.heartbeat) > CLIENT_TIMEOUT {
                println!("Websocket Client heartbeat failed, disconnecting!");
                ctx.stop();
                return;
            } else {
                ctx.ping(b"");
            }
        });
    }
}

impl Handler<UserMessage> for ChatWs {
    type Result = ();

    fn handle(&mut self, msg: UserMessage, ctx: &mut ws::WebsocketContext<Self>) -> Self::Result {
        ctx.text(msg.0)
    }
}

impl Handler<Pair> for ChatWs {
    type Result = ();

    fn handle(&mut self, msg: Pair, ctx: &mut ws::WebsocketContext<Self>) -> Self::Result {
        self.peer = Some(msg.0);

        ctx.text("Paired");
    }
}

impl Handler<Unpair> for ChatWs {
    type Result = ();

    fn handle(&mut self, _: Unpair, ctx: &mut ws::WebsocketContext<Self>) -> Self::Result {
        self.peer = None;
        ctx.text("Unpaired");

        self.server.do_send(Register {
            address: ctx.address(),
            user_type: self.user_type,
        });
    }
}

impl Handler<Full> for ChatWs {
    type Result = ();

    fn handle(&mut self, _: Full, ctx: &mut ws::WebsocketContext<Self>) -> Self::Result {
        ctx.text("Full");
        ctx.stop();
    }
}

/// Handler for ws::Message message
impl StreamHandler<Result<ws::Message, ws::ProtocolError>> for ChatWs {
    fn handle(&mut self, msg: Result<ws::Message, ws::ProtocolError>, ctx: &mut Self::Context) {
        match msg {
            Ok(ws::Message::Ping(msg)) => ctx.pong(&msg),
            Ok(ws::Message::Pong(_)) => self.heartbeat = Instant::now(),
            Ok(ws::Message::Text(text)) => {
                if let Some(peer) = self.peer.clone() {
                    peer.do_send(UserMessage(text))
                }
            }
            Ok(ws::Message::Close(_)) => ctx.stop(),
            _ => (),
        }
    }
}
