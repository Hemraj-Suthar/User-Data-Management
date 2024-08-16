document.addEventListener('DOMContentLoaded', () => {
    fetchData();
});

async function fetchData() {
    const response = await fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json');
    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
    }
    const allData = await response.json();
    for (const data of allData) {
        create_row(data);
    }
    create_pagination();
}

function create_row(data) {
    const adminRow = document.createElement('tr');
    adminRow.className = 'tableRow';
    adminRow.id = `row${data.id}`
    adminRow.innerHTML = `
            <td><input type="checkbox" class="selectRow" id=row${data.id}checkbox></td>
            <td class="edit">${data.name}</td>
            <td class="edit">${data.email}</td>
            <td class="edit">${data.role}</td>
            <td class="actions">
                <span id=edit_row_${data.id} class="edit-btn" onclick="edit_Row(event)"><i class="fa-solid fa-pen-to-square"></i></span>
                <span id=delete_row_${data.id} class="delete-btn" onclick="delete_Row(event)"><i class="fa-solid fa-trash"></i></span>
            </td>
        `;
    document.getElementById('Admin_Table').append(adminRow);
}

function edit_Row(event) {
    const rows = event.target.closest("tr");
    const editableCells = rows.querySelectorAll('.edit');
    editableCells.forEach(cell => cell.setAttribute('contentEditable', 'true'));
}

function delete_Row(event) {
    const row = event.target.closest('tr');
    row.remove();
}

function select_all_checkbox() {
    const seleceted_checkbox = document.querySelectorAll("input[type='checkbox']");
    const selectAll = seleceted_checkbox[0].checked;
    seleceted_checkbox.forEach((checkbox, index) => {
        if (index > 0 && index <= 10) {
            checkbox.checked = selectAll;
        }
    });
}

function delete_seleted_row() {
    const checkedCheckboxes = document.querySelectorAll("input[type='checkbox']:checked");
    checkedCheckboxes.forEach(checkbox => {
        checkbox.closest('tr').remove();
    });
}

function searchTableElements() {
    const searchedValue = document.getElementById("searchInput").value.toLowerCase();
    const rows = document.querySelectorAll('.tableRow');
    const displayRows = [];
    const hideRows = [];

    for (let i = 1; i < rows.length; i++) {
        let row = rows[i];
        let nameValue = row.cells[1].innerText.toLowerCase();
        let emailValue = row.cells[2].innerText.toLowerCase();
        let roleValue = row.cells[3].innerText.toLowerCase();

        if (nameValue.includes(searchedValue) || emailValue.includes(searchedValue) || roleValue.includes(searchedValue)) {
            displayRows.push(row.id);
            row.style.display = (displayRows.length <= 10) ? "table-row" : "none";
        } else {
            hideRows.push(row.id);
            row.style.display = "none";
        }
    }

    create_pagination(displayRows.length);
    return { displayRows, hideRows };
}

function create_pagination(available_elements_count = null) {
    const rows = document.querySelectorAll('.tableRow');
    const totalRows = available_elements_count !== null ? available_elements_count : rows.length - 1;
    const totalPages = Math.ceil(totalRows / 10);   
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = pageNum;
        pageButton.id = `pageCount${pageNum}`;
        pageButton.onclick = () => showPage(pageNum);
        pagination.appendChild(pageButton);
        pagination.appendChild(document.createTextNode(' '));
    }
}

function showPage(pageNumber) {
    let rows = document.querySelectorAll('.tableRow');
    let start = (pageNumber - 1) * 10 + 1;
    let end = start + 10;

    for (let i = 0; i < rows.length; i++) {
        rows[i].style.display = (i >= start && i < end) ? "table-row" : "none";
    }
}

// document.addEventListener('click', function (event) {
//     if (event.target.id.includes('pageCount')) {
//         const searchedValue = document.getElementById('searchInput').value;
//         const pageNumber = Number(event.target.innerText);

//         if (searchedValue === '') {
//             showPage(pageNumber);
//         } else {
//             const { displayRows } = searchTableElements();
//             const start = (pageNumber - 1) * 10;
//             const end = start + 10;

//             displayRows.forEach((rowId, index) => {
//                 const row = document.getElementById(rowId);
//                 if (index >= start && index < end) {
//                     row.style.display = "table-row";
//                 } else {
//                     row.style.display = "none";
//                 }
//             });
//         }
//     }
// });