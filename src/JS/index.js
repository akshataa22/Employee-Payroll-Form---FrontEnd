function getData() {
    $.ajax({
        url: 'http://localhost:3000/employees',
        type: 'GET',
        success: function (data) {
            console.log(data);
            displayEmployeeData(data);
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function openEmployeeForm() {
    window.location.href = "index.html";
}

function postData(employee) {
    $.ajax({
        url: 'http://localhost:3000/employees',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(employee),
        success: function (newEmployee) {
            console.log(newEmployee);
            addEmployeeToTable(newEmployee);
            window.location.href('details.html')
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function displayEmployeeData(data) {
    const table = document.querySelector('.table-container tbody');
    table.innerHTML = '';
    data.forEach(employee => {
        addEmployeeToTable(employee);
    });
}

function addEmployeeToTable(employee) {
    const table = document.querySelector('.table-container tbody');
    const row = table.insertRow();

    row.innerHTML = `
        <td  class="one"><img class="images" src="${employee.profile_image}" alt="person"></td>
        <td>${employee.name}</td>
        <td>${employee.gender}</td>
        <td class="departments">${employee.departments.map(department => `<span>${department}</span>`).join('')}</td>
        <td>${employee.salary}</td>
        <td>${employee.start_date}</td>
        <td>
            <i class="action bin fa-solid fa-trash"></i>
            <i class="action fa-solid fa-pen" data-employee-id="${employee.id}"></i>
        </td>
    `;

    row.querySelector(".fa-trash").addEventListener("click", function () {
        var employeeId = employee.id;
        $.ajax({
            url: 'http://localhost:3000/employees/' + employeeId,
            type: 'DELETE',
            success: function (data) {
                console.log(data);
                row.remove();
            },
            error: function (error) {
                console.log(error);
            }
        });
    });

   
    row.querySelector(".fa-pen").addEventListener("click", function () {
        var employeeId = employee.id;
      window.location.href= `index.html?id=${employeeId}`;
    });
}


$(document).ready(function () {
    getData();

    $("#goToIndex").click(function () {
        window.location.href = "index.html";
    });

    $("#searchIcon").click(function () {
        $("#searchBar").toggle().focus();
    });

    $("#searchBar").on("input", function () {
        const searchTerm = $(this).val().toLowerCase();
        $.ajax({
            url: 'http://localhost:3000/employees',
            type: 'GET',
            success: function (data) {
                const filteredData = data.filter(employee =>
                    employee.name.toLowerCase().includes(searchTerm) ||
                    employee.gender.toLowerCase().includes(searchTerm) ||
                    employee.departments.some(department => department.toLowerCase().includes(searchTerm)) ||
                    employee.salary.toString().includes(searchTerm) ||
                    employee.start_date.toLowerCase().includes(searchTerm)
                );
                displayEmployeeData(filteredData);
            },
            error: function (error) {
                console.log(error);
            }
        });
    });
});