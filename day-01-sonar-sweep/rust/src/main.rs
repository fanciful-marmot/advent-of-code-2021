use std::env;
use std::fs;

fn main() {
    let args: Vec<String> = env::args().collect();
    let filename = &args[1];

    println!("Reading input file {}", filename);
    let numbers = read_input(filename);

    println!("part 1: {}", part1(&numbers));
    println!("part 2: {}", part2(&numbers));
}

fn read_input(filename: &str) -> Vec<u32> {
    let contents = fs::read_to_string(filename).expect("Failed to read file");

    contents
        .lines()
        .map(|l| l.parse::<u32>().unwrap())
        .collect()
}

fn part1(numbers: &Vec<u32>) -> u32 {
    (0..numbers.len() - 1)
        .map(|pair_start| {
            let pair: Vec<&u32> = numbers.iter().skip(pair_start).take(2).collect();
            if pair[0] < pair[1] {
                1
            } else {
                0
            }
        })
        .sum()
}

fn part2(numbers: &Vec<u32>) -> u32 {
    // Calculate the window sums
    let window_sums = (0..numbers.len() - 2)
        .map(|window_start| numbers.iter().skip(window_start).take(3).sum())
        .collect();

    // Just run it through part 1
    part1(&window_sums)
}
