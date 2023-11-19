import Storage from "./Storage.js";

class CalorieTracker {
    #calorieLimit;
    #totalCalories;
    #meals;
    #workouts;

    constructor(){
        this.#calorieLimit = Storage.getCaloriesLimit();
        this.#totalCalories = Storage.getTotalCalories();
        this.#meals = Storage.getMeals();
        this.#workouts = Storage.getWorkouts();

        this.#render();
    }

    setCalorieLimit(limit){
        this.#calorieLimit = limit;
        Storage.setCalorieLimit(this.#calorieLimit);
        this.#render();
    }

    addMeal(meal){
        this.#meals.push(meal);
        Storage.saveMeal(meal);

        this.#totalCalories += meal.calories;
        Storage.updateTotalCalories(this.#totalCalories); //update to local storage

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
        Storage.saveWorkout(workout);

        this.#totalCalories -= workout.calories;
        Storage.updateTotalCalories(this.#totalCalories); //update to local storage

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
            Storage.updateTotalCalories(this.#totalCalories); //update to local storage
            this.#meals.splice(index, 1);
            Storage.removeMeal(id);
        }
        this.#render();
    }

    removeWorkout(id){
        const index = this.#workouts.findIndex((wo) => wo.id == id);

        if(index != -1){
            const workoutToRemove = this.#workouts[index];
            this.#totalCalories += workoutToRemove.calories;
            Storage.updateTotalCalories(this.#totalCalories); //update to local storage
            this.#workouts.splice(index, 1);
            Storage.removeWorkout(id);
        }
        this.#render();
    }

    loadItems(){
        this.#meals.forEach((meal) =>{
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
        })

        this.#workouts.forEach((workout) =>{
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
        })
    }

    resetTracker(){
        this.#totalCalories = 0;
        this.#meals = [];
        this.#workouts = [];
        Storage.clearAll();
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

export default CalorieTracker;