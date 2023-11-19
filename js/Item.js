class Meal {
    constructor(name, calories){
        this.id = Math.random().toString(16).slice(2); //Creating a random id, based on a hex string
        this.name = name;
        this.calories = calories;
    }
}

class Workout {
    constructor(name, calories){
        this.id = Math.random().toString(16).slice(2); //Creating a random id, based on a hex string
        this.name = name;
        this.calories = calories;
    }
}

export {
    Meal,
    Workout
}