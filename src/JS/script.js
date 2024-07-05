document.getElementById('submit-button').addEventListener("click", function (event) {
    event.preventDefault();

    let valid = true;

    const name = document.getElementById("name").value;
    const namePattern = /^([A-Z][a-zA-Z]+)( [A-Z][a-zA-Z]+)*$/;
    if (!namePattern.test(name)) {
        document.querySelector(".name-field span").style.display = "block";
        valid = false;
    } else {
        document.querySelector(".name-field span").style.display = "none";
    }

    const profileImage = document.querySelector('input[name="profile"]:checked');
    if (!profileImage) {
        document.querySelector(".profile-field span").style.display = "block";
        valid = false;
    } else {
        document.querySelector(".profile-field span").style.display = "none";
    }

    const gender = document.querySelector('input[name="gender"]:checked');
    if (!gender) {
        document.querySelector(".gender-field span").style.display = "block";
        valid = false;
    } else {
        document.querySelector(".gender-field span").style.display = "none";
    }

    const departmentElements = document.querySelectorAll('input[name="depart"]:checked');
    const departments = Array.from(departmentElements).map(element => element.value);
    if (departments.length === 0) {
        document.querySelector(".check-field span").style.display = "block";
        valid = false;
    } else {
        document.querySelector(".check-field span").style.display = "none";
    }

    const salary = document.getElementById('salary').value;
    if (!salary) {
        document.querySelector(".salary-field span").style.display = "block";
        valid = false;
    } else {
        document.querySelector(".salary-field span").style.display = "none";
    }

    const day = document.getElementById('day').value;
    const month = document.getElementById('month').value;
    const year = document.getElementById('year').value;
    if (day === "" || month === "" || year === "") {
        document.querySelector(".date-field span").style.display = "block";
        valid = false;
    } else {
        document.querySelector(".date-field span").style.display = "none";
    }

    const notes = document.getElementById('message').value;
    if (notes.trim() === "") {
        document.querySelector(".note-field span").style.display = "block";
        valid = false;
    } else {
        document.querySelector(".note-field span").style.display = "none";
    }

    if (valid) {
        const employee = {
            "name": name,
            "profile_image": profileImage.value,
            "gender": gender.value,
            "departments": departments,
            "salary": salary,
            start_date: `${day}.${month}.${year}`,
            "notes": notes
        }
    postData(employee)
    }
})

function postData(employee) {
    $.ajax({  
        url: 'http://localhost:3000/employees',  
        type: 'POST', 
        contentType: 'application/json',
        data: JSON.stringify(employee) ,
          success: function(data) {  
          console.log(data)   
          window.location.href = "details.html";
          console.log("data posted successfully")            
          }  
    });  
}

document.getElementById('update-button').addEventListener("click", function (event) {
    event.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const employeeId = urlParams.get('id');

    if (!employeeId) {
        console.error("Employee ID not found in URL parameters.");
        return;
    }
    const day = document.getElementById('day').value;
    const month = document.getElementById('month').value;
    const year = document.getElementById('year').value;
   const start_date=`${day}.${month}.${year}`;

    const employee = {
        "name": document.getElementById("name").value,
        "profile_image": document.querySelector('input[name="profile"]:checked').value,
        "gender": document.querySelector('input[name=gender]:checked').value,
        "departments": Array.from(document.querySelectorAll('input[name=depart]:checked')).map(element => element.value),
        "salary": document.getElementById('salary').value,
        "start_date": start_date,
        "notes": document.getElementById('message').value
    };

    $.ajax({
        url: 'http://localhost:3000/employees/' + employeeId,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(employee),
        success: function (updatedEmployee) {
            console.log(updatedEmployee);
            window.location.href = "details.html";
        },
        error: function (error) {
            console.error("Error updating employee data:", error);
        }
    });

    if (employeeId) {
        $.ajax({
            url: `/api/employees/${employeeId}`,
            method: 'GET',
            success: function (data) {
                $('#name').val(data.name);
                $(`input[name="profile"][value="${data.profile}"]`).prop('checked', true);
                $(`input[name="gender"][value="${data.gender}"]`).prop('checked', true);
                data.department.forEach(function (dept) {
                    $(`input[name="depart"][value="${dept}"]`).prop('checked', true);
                });
                $('#salary').val(data.salary);
                $('#day').val(new Date(data.startDate).getDate());
                $('#month').val(new Date(data.startDate).getMonth() + 1);
                $('#year').val(new Date(data.startDate).getFullYear());
                $('#message').val(data.message);
            },
            error: function (err) {
                console.error('Error fetching employee data:', err);
            }
        });
    }
    
});

$(document).ready(function(){
    const urlParams = new URLSearchParams(window.location.search);
    const employeeId = urlParams.get('id');

    if (employeeId) {
        $("#submit-button").hide();
        $("#update-button").show();
        loadEmployeeData(employeeId);
    } else {
        $("#submit-button").show();
        $("#update-button").hide();
    }
});

function loadEmployeeData(employeeId) {
    $.ajax({
        url: 'http://localhost:3000/employees/' + employeeId,
        type: 'GET',
        success: function (data) {
            $('#name').val(data.name);
            $(`input[name="profile"][value="${data.profile_image}"]`).prop('checked', true);
            $(`input[name="gender"][value="${data.gender}"]`).prop('checked', true);
            data.departments.forEach(function (dept) {
                $(`input[name="depart"][value="${dept}"]`).prop('checked', true);
            });
            $('#salary').val(data.salary);
            const [day, month, year] = data.start_date.split('.');
            $('#day').val(day);
            $('#month').val(month);
            $('#year').val(year);
            $('#message').val(data.notes);
        },
        error: function (error) {
            console.log(error);
        }
    });
}