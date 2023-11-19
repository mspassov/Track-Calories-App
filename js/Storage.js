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

export default Storage;