class CalorieTracker {
    #calorieLimit;
    #totalCalories;
    #meals;
    #workouts;

    constructor(){
        this.#calorieLimit = 2000;
        this.#totalCalories = 0;
        this.#meals = [];
        this.#workouts = [];

        this.#render();
    }

    addMeal(meal){
        this.#meals.push(meal);
        this.#totalCalories += meal.calories;

        //Add the meal to the page
        const card = document.createElement('div');
        card.classList.add('card', 'my-2');
        card.setAttribute('data-id', meal.id);
        card.innerHTML =
        `<div class="card-body">
            <div class="d-flex align-items-center justify-content-between">
                <h4 class="mx-1">${meal.name}</h4>
                <div class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5">
                ${meal.calories}
                </div>
                <button class="delete btn btn-danger btn-sm mx-2">
                <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
        </div>`
        document.querySelector('#meal-items').appendChild(card);

        this.#render();
    }

    addWorkout(workout){
        this.#workouts.push(workout);
        this.#totalCalories -= workout.calories;

        //Add workout to the page
        const card = document.createElement('div');
        card.classList.add('card', 'my-2');
        card.setAttribute('data-id', workout.id);
        card.innerHTML = 
        `<div class="card-body">
            <div class="d-flex align-items-center justify-content-between">
                <h4 class="mx-1">${workout.name}</h4>
                <div class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5">${workout.calories}</div>
                <button class="delete btn btn-danger btn-sm mx-2">
                <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
        </div>`
        document.getElementById('workout-items').appendChild(card);

        this.#render();
    }

    removeMeal(id){
        const index = this.#meals.findIndex((meal) => meal.id == id);

        if(index != -1){
            const mealToRemove = this.#meals[index];
            this.#totalCalories -= mealToRemove.calories;
            this.#meals.splice(index, 1);
        }
        this.#render();
    }

    removeWorkout(id){
        const index = this.#workouts.findIndex((wo) => wo.id == id);

        if(index != -1){
            const workoutToRemove = this.#workouts[index];
            this.#totalCalories += workoutToRemove.calories;
            this.#workouts.splice(index, 1);
        }
        this.#render();
    }

    #displayNetCalories(){
        const netCaloriesEl = document.querySelector('#calories-total');
        netCaloriesEl.innerHTML = this.#totalCalories;
    }

    #displayCaloriesLimit(){
        const caloriesLimit = document.querySelector('#calories-limit');
        caloriesLimit.innerHTML = this.#calorieLimit;
    }

    #displayConsumedCalories(){
        let consumedCalories = 0;
        this.#meals.forEach(meal => consumedCalories += meal.calories);
        document.querySelector('#calories-consumed').innerHTML = consumedCalories;
    }

    #displayBurnedCalories(){
        let burnedCalories = 0;
        this.#workouts.forEach(workout => burnedCalories += workout.calories);
        document.querySelector('#calories-burned').innerHTML = burnedCalories;
    }

    #displayCaloriesRemainig(){
        const remaining = this.#calorieLimit - this.#totalCalories;
        document.querySelector('#calories-remaining').innerHTML = remaining;
        
        //Make the card red, if we exceed the limit
        if(remaining <= 0){
            document.querySelector('#calories-remaining').parentElement.parentElement.classList.remove('bg-light');
            document.querySelector('#calories-remaining').parentElement.parentElement.classList.add('bg-danger');

            document.querySelector('#calorie-progress').classList.add('bg-danger');
            document.querySelector('#calorie-progress').classList.remove('progress-bar');
        }
        else{
            document.querySelector('#calories-remaining').parentElement.parentElement.classList.add('bg-light');
            document.querySelector('#calories-remaining').parentElement.parentElement.classList.remove('bg-danger');

            document.querySelector('#calorie-progress').classList.remove('bg-danger');
            document.querySelector('#calorie-progress').classList.add('progress-bar');
        }
    }

    #renderProgressBar(){
        const percent = (this.#totalCalories / this.#calorieLimit) * 100;
        const width = Math.min(100, percent);
        const progressBar = document.querySelector('#calorie-progress');
        progressBar.style.width = `${width}%`;
    }

    #render(){
        this.#displayNetCalories();
        this.#displayCaloriesLimit();
        this.#displayConsumedCalories();
        this.#displayBurnedCalories();
        this.#displayCaloriesRemainig();
        this.#renderProgressBar();
    }
}

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

class App{
    #domTracker;

    constructor(){
        this.#domTracker = new CalorieTracker();

        document.querySelector('#meal-form').addEventListener('submit', this.#newMeal.bind(this));
        document.querySelector('#workout-form').addEventListener('submit', this.#newWorkout.bind(this));
        document.querySelector('#meal-items').addEventListener('click', this.#removeMeal.bind(this));
        document.querySelector('#workout-items').addEventListener('click', this.#removeWorkout.bind(this));
    }

    #newMeal(e){
        e.preventDefault();
        
        const mealName = document.querySelector('#meal-name').value;
        const calNum = document.querySelector('#meal-calories').value;
        
        //Simple Validations
        if(mealName == '' || calNum == '' || calNum == 0){
            alert("Please enter a meal name and calorie number greater than 0");
            return;
        }

        const mealObj = new Meal(mealName, parseInt(calNum));
        this.#domTracker.addMeal(mealObj);

        document.querySelector('#meal-name').value = '';
        document.querySelector('#meal-calories').value = '';

        //Collapse the form after submission
        const collapseMeal = document.getElementById('collapse-meal');
        bootstrap.Collapse.getInstance(collapseMeal).hide();
    }

    #newWorkout(e){
        e.preventDefault();
        
        const workoutName = document.querySelector('#workout-name').value;
        const calNum = document.querySelector('#workout-calories').value;
        
        //Simple Validations
        if(workoutName == '' || calNum == '' || calNum == 0){
            alert("Please enter a workout name and calorie number greater than 0");
            return;
        }

        const workoutObj = new Workout(workoutName, parseInt(calNum));
        this.#domTracker.addWorkout(workoutObj);

        document.querySelector('#workout-name').value = '';
        document.querySelector('#workout-calories').value = '';

        //Collapse the form after submission
        const collapseWorkout = document.getElementById('collapse-workout');
        bootstrap.Collapse.getInstance(collapseWorkout).hide();
    }

    #removeMeal(e){
        if(e.target.classList.contains('fa-xmark') || e.target.classList.contains('delete')){
            const cardId = e.target.closest('.card').getAttribute('data-id');
            this.#domTracker.removeMeal(cardId);
            e.target.closest('.card').remove();
        }
    }

    #removeWorkout(e){
        if(e.target.classList.contains('fa-xmark') || e.target.classList.contains('delete')){
            const cardId = e.target.closest('.card').getAttribute('data-id');
            this.#domTracker.removeWorkout(cardId);
            e.target.closest('.card').remove();
        }
    }
}

const app = new App();