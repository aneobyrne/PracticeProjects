function addTask() {
    const taskInput = document.getElementById('taskInput'); //task written by user
    const taskText = taskInput.value.trim(); //gets what the user typed and removes spaces at the start/end

    if (taskText === '') {
        alert('No task has been entered!');
        return;
    }

    const taskList = document.getElementById('taskList');
    const listItem = document.createElement('li');

    // Task text span (holds the text that the user wrote)
    const taskSpan = document.createElement('span');
    taskSpan.textContent = taskText;

    // Complete button
    const completeButton = document.createElement('button');
    completeButton.innerHTML = '✔'; //Shows checkmark icon
    completeButton.onclick = () => {
        taskSpan.classList.toggle('completed'); //when clicked, it toggles the CSS class completed
    };

    // Remove button
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.className = 'remove-btn';
    removeButton.onclick = () => {
        taskList.removeChild(listItem);
    };

    // Append everything
    listItem.appendChild(completeButton);
    listItem.appendChild(taskSpan);
    listItem.appendChild(removeButton);

    taskList.appendChild(listItem);

    taskInput.value = ''; // Clear input field
}

// Allow pressing Enter to add a task aswell
document.getElementById("taskInput").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {  
        addTask(); 
    }
});
