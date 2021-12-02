use std::env;
use std::fs;

struct Vec2 {
    pub x: i32,
    pub y: i32,
}

fn main() {
    let args: Vec<String> = env::args().collect();
    let filename = &args[1];

    println!("Reading input file {}", filename);
    let movements = read_input(filename);

    println!("part 1: {}", part1(&movements));
    // println!("part 2: {}", part2(&numbers));
}

fn read_input(filename: &str) -> Vec<Vec2> {
    let contents = fs::read_to_string(filename).expect("Failed to read file");

    contents
        .lines()
        .map(|l| {
            let parts: Vec<&str> = l.split(' ').collect();

            match parts[0] {
                "forward" => Vec2 { x: parts[1].parse::<i32>().unwrap(), y: 0},
                "up" => Vec2 { x: 0, y: -parts[1].parse::<i32>().unwrap()},
                "down" => Vec2 { x: 0, y: parts[1].parse::<i32>().unwrap()},
                _ => panic!("Unknown instruction \"{}\"", parts[0])
            }
        })
        .collect()
}

fn part1(movements: &Vec<Vec2>) -> i32 {
    let position = movements.iter().fold((0, 0), |acc, vec| (acc.0 + vec.x, acc.1 + vec.y));

    position.0 * position.1
}

// fn part2(numbers: &Vec<u32>) -> u32 {
// }
