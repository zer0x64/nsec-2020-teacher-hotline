use std::time::Instant;

use rand::Rng;

mod ws_actors;
use ws_actors::{ChatWs, PairingServer, UserType};

use actix::{Actor, Addr};
use actix_files::NamedFile;
use actix_session::{CookieSession, Session};
use actix_web::{middleware, web, App, HttpRequest, HttpResponse, HttpServer, Responder};
use actix_web_actors::ws;
use serde::{Deserialize, Serialize};

use hex_literal::hex;
use sha2::{Digest, Sha256};

use structopt::StructOpt;

#[derive(Debug, Serialize, Deserialize)]
struct Credentials {
    username: String,
    password: String,
}

#[derive(StructOpt, Debug)]
#[structopt(name = "pychat")]
struct Opt {
    /// Decides which address to bind to
    #[structopt(short, long)]
    production: bool,

    //#[structopt(short, long)]
    //clientserver: String,
}

async fn index() -> impl Responder {
    NamedFile::open("./client_build/index.html")
}

fn session_is_logged_in(session: &Session) -> bool {
    let is_logged_in = match session.get("isLoggedIn") {
        Ok(is_logged_in) => match is_logged_in {
            Some(is_logged_in) => is_logged_in,
            _ => false,
        },
        _ => false,
    };

    return is_logged_in;
}

async fn login(data: web::Json<Credentials>, session: Session) -> impl Responder {
    let mut hasher = Sha256::new();
    hasher.input(data.0.password);
    let result = hasher.result();

    if data.0.username == "Teacher1"
        && result[..] == hex!("eb45d6cb783a509036744dd650a0e039f47d58cbe345ba9208c24b046287217e")
    {
        session.set("isLoggedIn", true).unwrap();
        HttpResponse::Ok()
    } else {
        HttpResponse::Unauthorized().into()
    }
}

async fn logout(session: Session) -> impl Responder {
    match session.set("isLoggedIn", false) {
        Ok(_) => HttpResponse::Ok(),
        Err(_) => HttpResponse::InternalServerError(),
    }
}

async fn is_logged_in(session: Session) -> impl Responder {
    if session_is_logged_in(&session) {
        HttpResponse::Ok()
    } else {
        HttpResponse::Unauthorized().into()
    }
}

async fn flag(session: Session) -> impl Responder {
    if session_is_logged_in(&session) {
        HttpResponse::Ok().body("FLAG-06b8f0780ccd49c4be75f578aab071f3")
    } else {
        HttpResponse::Unauthorized().into()
    }
}

async fn ws_index(
    r: HttpRequest,
    stream: web::Payload,
    session: Session,
    server: web::Data<Addr<PairingServer>>,
) -> impl Responder {
    if session_is_logged_in(&session) {
        println!("Teacher connection...");
        ws::start(
            ChatWs {
                user_type: UserType::Teacher,
                peer: None,
                server: server.get_ref().clone(),
                heartbeat: Instant::now(),
            },
            &r,
            stream,
        )
    } else {
        println!("Student connection...");
        ws::start(
            ChatWs {
                user_type: UserType::Student,
                peer: None,
                server: server.get_ref().clone(),
                heartbeat: Instant::now(),
            },
            &r,
            stream,
        )
    }
}

#[actix_rt::main]
async fn main() -> std::io::Result<()> {
    std::env::set_var("RUST_LOG", "info");
    flexi_logger::Logger::with_env()
        .format(flexi_logger::colored_default_format)
        .start()
        .unwrap();

    let opt = Opt::from_args();
    let addr = if opt.production {
        "[::]:80"
    } else {
        "127.0.0.1:8081"
    };

    let server = PairingServer::new().start();
    let mut session_key = [0u8; 32];
    rand::thread_rng().fill(&mut session_key);

    HttpServer::new(move || {
        App::new()
            .wrap(middleware::Logger::default())
            .wrap(
                CookieSession::signed(&session_key)
                    .secure(false)
                    .http_only(false),
            )
            .app_data(web::Data::new(server.clone()))
            .route("/ws", web::get().to(ws_index))
            .route("/isLoggedIn", web::get().to(is_logged_in))
            .route("/flag", web::get().to(flag))
            .route("/", web::get().to(index))
            .route("/index.html", web::get().to(index))
            .route("/login", web::post().to(login))
            .route("/logout", web::get().to(logout))
            .service(
                actix_files::Files::new("client", "client_build").disable_content_disposition(),
            )
    })
    .bind(addr)?
    .run()
    .await
}
