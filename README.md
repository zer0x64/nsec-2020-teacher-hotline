# NSEC 2020: Teacher's Hotline
This challenge was presented at NorthSec 2020. The participants were required to gain access to a teacher's account via a client side exploit.

# How to build
You need a working rust(with `cargo`) and npm setup to build the challenge. The challenge is made to be built and ran on Linux, but can probably work 
on other platforms as well.

## Build the client
To build the client, go in the `client_build` directory, then run:
```
npm install
npm run build
cp -r dist/ ../client_build
```
This will build the client code and put it in the `client_build/` folder, which will be server statically by the server.

## Build and run the server
From the repo root:
```
cargo run --release
```

This will run the server on 127.0.0.1:8080. The `--release` flag is not mandatory, but since the server is ressource hungry it's better to build as release.

## Build the fake client
I don't recommand to use the fake client(AKA XSS bot), you're better off XSSing yourself directly using two browsers(credentials for the teacher can be found in `fake-client/client.js`). If you want to run the bot for, let's say, hosting the challenge, you will need to install the requisites to use `pupeteer` and then run the following commands in the `fake-client/` directory:
```
npm install
npm start
```

# Credits (contains spoiler for the challenge)
A big part of the projet is the [RustPython project](https://github.com/RustPython/RustPython), which is used to run a Python interpreter in a WebAssembly module.
Here it is not imported elegantly, especially since some backdoor code has been inserted during the build process for the sake of simplifying exploitation.
