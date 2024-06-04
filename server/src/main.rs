#[macro_use]
extern crate rocket;

use rocket::response::stream::TextStream;
use rocket::tokio::time::{interval, Duration};
use rocket::Request;

#[get("/")]
fn index() -> &'static str {
    "Hello, world!"
}

/// Produce an infinite series of `"hello"`s, one per second.
#[get("/infinite-hellos")]
fn hello() -> TextStream![&'static str] {
    TextStream! {
        let mut interval = interval(Duration::from_secs(1));
        loop {
            yield "hello";
            interval.tick().await;
        }
    }
}

#[catch(404)]
fn not_found(req: &Request) -> String {
    format!("Sorry, '{}' is not a valid path.", req.uri())
}

#[launch]
fn rocket() -> _ {
    rocket::build()
        .mount("/", routes![index])
        .mount("/", routes![hello])
        .register("/", catchers![not_found])
}
