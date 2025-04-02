use crate::woolie::Woolie;

use std::{
    collections::{VecDeque},
    sync::{Arc, Mutex},
};

pub struct Bridge {
    capacity: i32,
    locks: Vec<Arc<Mutex<i32>>>,
    queue: VecDeque<Woolie>,
}

impl Bridge {
    pub fn new(capacity: i32) -> Bridge {
        Bridge {
            capacity,
            locks: Vec::new(),
            queue: VecDeque::new(),
        }
    }

    pub fn request_key(&mut self, woolie: Woolie) {
        // If there are fewer active keys than capacity, immediately alert the thread
        // If there are no keys available, add the thread to a queue
        if(self.open_locks().is_empty()) {

        } else {
            
        }
    }

    pub fn release_key(&mut self, key: i32) {
        
    }

    fn open_locks(&self) -> Vec<Arc<Mutex<i32>>> {
        return self.locks
            .iter()
            .filter(|lock| !lock.try_lock().is_err())
            .cloned()
            .collect::<Vec<Arc<Mutex<i32>>>>();
    }
}
