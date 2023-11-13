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

class Storage{
    static getCaloriesLimit(defaultLimit = 2000){
        let calLimit;
        if(localStorage.getItem('calorieLimit') == null){
            calLimit = defaultLimit;
        }
        else{
            calLimit = parseInt(localStorage.getItem('calorieLimit'));
        }
        return calLimit;
    }

    static setCalorieLimit(calLimit){
        localStorage.setItem('calorieLimit', calLimit);
    }

    static getTotalCalories(defaultCal = 0){
        let total;
        if(localStorage.getItem('totalCalories') == null){
            total = 0;
        }
        else{
            total = parseInt(localStorage.getItem('totalCalories'));
        }

        return total;
    }

    static updateTotalCalories(calories){
        localStorage.setItem('totalCalories', calories);
    }

    static getMeals(){
        let meals;
        if(localStorage.getItem('mealsArray') == null){
            meals = []
        }
        else{
            meals = JSON.parse(localStorage.getItem('mealsArray'))
        }
        return meals;
    }

    static saveMeal(meal){
        let currentMeals = Storage.getMeals();
        currentMeals.push(meal);
        localStorage.setItem('mealsArray', JSON.stringify(currentMeals));
    }

    static removeMeal(id){
        let mealsArray = Storage.getMeals();
        const newMealsArr = mealsArray.filter((meal) => (meal.id != id));
        localStorage.setItem('mealsArray', JSON.stringify(newMealsArr));
    }

    static getWorkouts(){
        let workouts;
        if(localStorage.getItem('workoutsArray') == null){
            workouts = []
        }
        else{
            workouts = JSON.parse(localStorage.getItem('workoutsArray'))
        }
        return workouts;
    }

    static saveWorkout(workout){
        let currentWorkouts = Storage.getWorkouts();
        currentWorkouts.push(workout);
        localStorage.setItem('workoutsArray', JSON.stringify(currentWorkouts));
    }

    static removeWorkout(id){
        let workoutsArray = Storage.getWorkouts();
        const newWorkoutsArr = workoutsArray.filter((workout) => (workout.id != id));
        localStorage.setItem('workoutsArray', JSON.stringify(newWorkoutsArr));
    }

    static clearAll(){
        localStorage.clear();
    }
}

class App{
    #domTracker;

    constructor(){
        this.#domTracker = new CalorieTracker();
        this.#domTracker.loadItems();

        document.querySelector('#meal-form').addEventListener('submit', this.#newMeal.bind(this));
        document.querySelector('#workout-form').addEventListener('submit', this.#newWorkout.bind(this));
        document.querySelector('#meal-items').addEventListener('click', this.#removeMeal.bind(this));
        document.querySelector('#workout-items').addEventListener('click', this.#removeWorkout.bind(this));
        document.querySelector('#filter-meals').addEventListener('keyup', this.#filterItem.bind(this, 'meal'));
        document.querySelector('#filter-workouts').addEventListener('keyup', this.#filterItem.bind(this, 'workout'));
        document.querySelector('#reset').addEventListener('click', this.#resetDay.bind(this));
        document.querySelector('#limit-form').addEventListener('submit', this.#setCalorieLimit.bind(this));
    }

    #setCalorieLimit(e){
        e.preventDefault();
        
        const limit = document.querySelector('#limit').value;
        if(limit == ''){
            alert("Please enter a number greater than zero");
            return;
        }

        document.querySelector('#limit').value = '';
        this.#domTracker.setCalorieLimit(parseInt(limit));

        const modalElement = document.getElementById('limit-modal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();
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

    #filterItem(type, e){
        const input = e.target.value.toLowerCase();
        document.querySelectorAll(`#${type}-items .card`).forEach((item) =>{
            const name = item.firstElementChild.firstElementChild.innerText;
            if(name.toLowerCase().includes(input)){
                item.style.display = 'block';
            }
            else{
                item.style.display = 'none';
            }
        })

    }

    #resetDay(e){
        this.#domTracker.resetTracker();
        document.getElementById('meal-items').innerHTML = '';
        document.getElementById('workout-items').innerHTML = '';
        document.getElementById('filter-meals').value = '';
        document.getElementById('filter-workouts').value = '';
    }
}

const app = new App();