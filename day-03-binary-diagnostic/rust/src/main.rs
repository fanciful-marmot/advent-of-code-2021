use std::env;
use std::fs;

fn main() {
    let args: Vec<String> = env::args().collect();
    let filename = &args[1];

    println!("Reading input file {}", filename);
    let lines = read_input(filename);

    println!("part 1: {}", part1(&lines));
    println!("part 2: {}", part2(&lines));
}

fn read_input(filename: &str) -> Vec<String> {
    let contents = fs::read_to_string(filename).expect("Failed to read file");

    contents
        .lines()
        .map(|l| String::from(l))
        .collect()
}

fn part1(lines: &Vec<String>) -> u32 {
    let num_digits = lines[0].len();
    let num_lines = lines.len();
    let counts = lines.iter()
        // Count the number of 1's at each position
        .fold(vec![0; num_digits], |mut acc, line| {
            for i in 0..num_digits {
                if line.chars().nth(i).unwrap() == '1' {
                    acc[i] += 1;
                }
            }

            acc
        });

    let mut gamma: u32 = 0;
    for (i, &count) in counts.iter().enumerate() {
        if count > num_lines / 2 {
            gamma = gamma | (1 << num_digits - i - 1);
        }
    }
    let epsilon = !gamma & ((1 << num_digits as u32) - 1);

    gamma * epsilon
}

fn part2(_lines: &Vec<String>) -> u32 {
    0
}
