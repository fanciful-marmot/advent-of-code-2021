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

fn split_filter_at_bit<'a>(lines: &Vec<&'a String>, bit_index: usize) -> (Vec<&'a String>, Vec<&'a String>) {
    let mut zero = Vec::new();
    let mut one = Vec::new();

    for &line in lines {
        if line.chars().nth(bit_index).unwrap() == '0' {
            zero.push(line);
        } else {
            one.push(line);
        }
    }

    (zero, one)
}

fn part2(lines: &Vec<String>) -> u32 {
    let num_digits = lines[0].len();

    // Determine majority
    let oxygen_rating = {
        let mut majority: Vec<&String> = lines.iter().collect();
        for i in 0..num_digits {
            let (zero, one) = split_filter_at_bit(&majority, i);
            majority = if one.len() >= zero.len() {
                one
            } else {
                zero
            };

            if majority.len() == 1 {
                break;
            }
        }
        isize::from_str_radix(&majority[0], 2).unwrap() as u32
    };

    // Determine majority
    let co2_scrubber = {
        let mut minority: Vec<&String> = lines.iter().collect();
        for i in 0..num_digits {
            let (zero, one) = split_filter_at_bit(&minority, i);
            minority = if one.len() >= zero.len() {
                zero
            } else {
                one
            };

            if minority.len() == 1 {
                break;
            }
        }
        isize::from_str_radix(&minority[0], 2).unwrap() as u32
    };


    oxygen_rating * co2_scrubber
}
