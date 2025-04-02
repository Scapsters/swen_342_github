use std::{sync::{Arc, Mutex}, thread};

use crate::city::City;

#[derive(PartialEq, Clone)]
pub struct Woolie {
    pub name: String,
    pub time: u32,
    pub destination: City,
}

impl Woolie {
    pub fn new(name: String, time: u32, destination: City) -> Woolie {
        Woolie {
            name,
            time,
            destination,
        }
    }
    
    pub fn cross_bridge(&self) {
        println!(
            "Woolie {} is starting to cross the bridge for {} seconds",
            self.name, self.time
        );
        for _ in 0..=self.time {
            thread::sleep(std::time::Duration::from_secs(1));
        }
    }
}
