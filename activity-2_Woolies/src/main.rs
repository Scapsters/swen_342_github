mod woolie;
use crate::woolie::Woolie;

mod city;
use crate::city::City;

mod random;
use crate::random::RandomVariant;

mod bridge;
use crate::bridge::Bridge;

use rand::Rng;
use std::thread::JoinHandle;

fn main() {
    let mut rng = rand::thread_rng();

    let bridge = Bridge::new(3);
    let threads: Vec<JoinHandle<()>> = (1..=10)
        .map(|i| {
            bridge.request_key(Woolie::new(
                i.to_string(),
                rng.gen_range(3..=6),
                City::random(),
            ))
        })
        .collect();

    threads.into_iter().for_each(|t| {
        let _ = t.join();
    });
}
