document.addEventListener('DOMContentLoaded', function() {
    loadData();
    document.getElementById('bulkDelete').addEventListener('click', bulkDelete);
});

function loadData(page = 1) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'data.html', true);
    xhr.onload = function() {
        if(this.status === 200) {
            const data = JSON.parse(this.responseText);
            populateTable(data, page);
            setupPagination(data.length);
        }
    }
    xhr.send();
}

function populateTable(data, page) {
    const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';


    const itemsPerPage = 10;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = data.slice(startIndex, endIndex);

    paginatedItems.forEach((item, index) => {
        const row = tableBody.insertRow();
        row.className = "json-data";
        row.innerHTML = `
            <td><input type="checkbox" class="selectRow"></td>
            <td>${item.name}</td>
            <td>${item.email}</td>
            <td>${item.role}</td>
            <td class="actions">
                <span class="edit-btn" onclick="editRow(this)">Edit</span>
                <span class="delete-btn" onclick="deleteRow(this)">Delete</span>
            </td>
        `;
    });
    
}

function setupPagination(totalItems) {
    const paginationDiv = document.getElementById('pagination');
    paginationDiv.innerHTML = '';

    const pages = Math.ceil(totalItems / 10);

    for (let j = 1; j <= pages; j++) {
        const pageNumber = document.createElement('span');
        pageNumber.className = 'page-number';
        pageNumber.innerText = j;
        pageNumber.addEventListener('click', function() {
            loadData(j);
            
        });
        paginationDiv.appendChild(pageNumber);
    }
}

function editRow(element) {
    // ... (pending) ...
}

function deleteRow(element) {
    element.parentElement.parentElement.remove();
}

function bulkDelete() {
    const selectedRows = document.querySelectorAll('.selectRow:checked');
    // console.log(selectedRows);
    selectedRows.forEach(checkbox => {
        const row = checkbox.parentElement.parentElement;
        row.remove();
    });
}

function filterItems() {
var input, filter, itemList, items, item, i, txtValue;
input = document.getElementById("searchInput");
filter = input.value.toUpperCase();
items = document.getElementsByClassName("json-data");
// var tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
// console.log(items);
for (i = 0; i < items.length; i++) {
    txtValue = items[i].textContent || items.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
        items[i].style.display = "";
    } else {
        items[i].style.display = "none";
    }
    // console.log();
}};