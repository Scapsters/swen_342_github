#[derive(PartialEq, Clone)]
pub enum City {
    Merctan,
    Sicstine,
}

impl City {
    pub fn to_string(&self) -> String {
        match self {
            City::Merctan => "Merctan".to_string(),
            City::Sicstine => "Sicstine".to_string(),
        }
    }
}
