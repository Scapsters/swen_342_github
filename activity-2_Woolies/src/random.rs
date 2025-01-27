use crate::city::City;

pub trait RandomVariant {
    fn random() -> Self;
}

impl RandomVariant for City {
    fn random() -> City {
        match rand::random::<u8>() % 2 {
            0 => City::Merctan,
            _ => City::Sicstine,
        }
    }
}
