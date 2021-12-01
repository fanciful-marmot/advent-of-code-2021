use std::env;
use std::fs;

fn main() {
    let args: Vec<String> = env::args().collect();
    let filename = &args[1];

    println!("Reading input file {}", filename);
    let numbers = read_input(filename);

    println!("part 1: {}", part1(&numbers));
}

fn read_input(filename: &str) -> Vec<u32> {
    let contents = fs::read_to_string(filename).expect("Failed to read file");

    contents
        .lines()
        .map(|l| l.parse::<u32>().unwrap())
        .collect()
}

fn part1(numbers: &Vec<u32>) -> u32 {
    let mut previous: u32 = numbers[0];
    let mut num_increases = 0;

    for &n in numbers {
        if n > previous {
            num_increases += 1;
        }
        previous = n;
    }

    num_increases
}
