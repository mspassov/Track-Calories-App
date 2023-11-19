import CalorieTracker from "./CalorieTracker.js";
import {Meal, Workout} from "./Item.js";

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