mod woolie;
use crate::woolie::Woolie;

mod city;
use crate::city::City;

mod random;
use crate::random::RandomVariant;

mod bridge;
use crate::bridge::Bridge;

use rand::Rng;
use std::thread;

fn main() {
    let mut rng = rand::thread_rng();

    let woolies: Vec<_> = (1..=3)
        .map(|i| Woolie::new(i.to_string(), rng.gen_range(3..=6), City::random()))
        .collect();

    let threads: Vec<_> = woolies
        .into_iter()
        .map(|woolie| build_thread(move || woolie.run()))
        .collect();

    threads
        .into_iter()
        .for_each(|thread| thread.join().unwrap());
}

fn build_thread<T: FnOnce() + Send + 'static>(function: T) -> thread::JoinHandle<()> {
    thread::Builder::new()
        .spawn(|| function())
        .expect("Failed to create thread")
}
