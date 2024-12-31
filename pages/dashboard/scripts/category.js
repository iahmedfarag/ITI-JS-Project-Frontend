// Category

var modalOrder = document.getElementById('Dom-modal-category');

function ViewModalCategory() {
    modalOrder.style.visibility = "visible";
    modalOrder.style.display = "flex";
}
function closeModalCategory() {
    modalOrder.style.visibility = "hidden";
    modalOrder.style.display = "none";
}


const form = document.getElementById('addCategoryForm');
const token = localStorage.getItem('authToken');

if (!token) {
    alert('User not authenticated!');
    console.log('Token not found.');
}

form.addEventListener('submit', async function (event) {
    event.preventDefault();

   
    const categoryNameInput = document.getElementById('categoryName'); 
    const categoryName = categoryNameInput.value.trim();




    if (!categoryName) {
        alert('Category name is required.');
        return;
    }

    if (categoryName.length > 20) {
        alert('Category name must be less than or equal to 20 characters.');
        return;
    }

    try {
        const response = await fetch('https://iti-js-project-backend.vercel.app/api/categories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ name: categoryName }),
        });

        if (response.ok) {
            alert('Category added successfully!');
            categoryNameInput.value = '';
           closeModalCategory();
           window.location.reload()
        } else {
            const errorData = await response.json();
            console.error('Server error:', errorData);
            alert(`Error: ${errorData.message || 'Failed to add category.'}`);
        }
    } catch (error) {
        console.error('Error occurred:', error);
        alert('An unexpected error occurred.');
    }
});
