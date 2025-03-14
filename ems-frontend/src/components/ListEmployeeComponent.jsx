import React, { useEffect, useState } from 'react';
import { deleteEmployee, listEmployees } from '../services/EmployeeService';
import { useNavigate } from 'react-router-dom';

const ListEmployeeComponent = () => {
    const [employees, setEmployees] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const employeesPerPage = 3; // Max 3 records per page

    const navigator = useNavigate();

    useEffect(() => {
        getAllEmployees();
    }, []);

    function getAllEmployees() {
        listEmployees()
            .then((response) => {
                setEmployees(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }

    function addNewEmployee() {
        navigator('/add-employee');
    }

    function updateEmployee(id) {
        if (window.confirm("Are you sure you want to update this employee?")) {
            navigator(`/edit-employee/${id}`);
        }
    }

    function removeEmployee(id) {
        if (window.confirm("Are you sure you want to delete this employee?")) {
            deleteEmployee(id)
                .then(() => {
                    alert("Employee deleted successfully!");
                    getAllEmployees();
                })
                .catch(error => {
                    console.error(error);
                    alert("Error deleting employee!");
                });
        }
    }

    // Pagination Logic
    const indexOfLastEmployee = currentPage * employeesPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
    const currentEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee);

    const totalPages = Math.ceil(employees.length / employeesPerPage);

    return (
        <div className='container'>
            <h2 className='text-center' style={{ 
                color: '#4A90E2', 
                fontWeight: 'bold', 
                fontSize: '2rem', 
                textTransform: 'uppercase',
                letterSpacing: '2px',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' 
            }}>
                List of Employees
            </h2>
            
            <button className='btn btn-success mb-3' onClick={addNewEmployee} style={{
                fontWeight: 'bold',
                letterSpacing: '1px'
            }}>➕ Add Employee</button>
            
            <table className='table' style={{ 
                border: '5px solid #007bff', 
                borderRadius: '10px',
                overflow: 'hidden'
            }}>
                <thead>
                    <tr style={{ backgroundColor: '#007bff', color: 'white', fontSize: '1.2rem', textAlign: 'center' }}>
                        <th style={{ padding: '12px', border: '3px solid white' }}>Employee Id</th>
                        <th style={{ padding: '12px', border: '3px solid white' }}>First Name</th>
                        <th style={{ padding: '12px', border: '3px solid white' }}>Last Name</th>
                        <th style={{ padding: '12px', border: '3px solid white' }}>Email</th>
                        <th style={{ padding: '12px', border: '3px solid white' }}>Department Name</th>
                        <th style={{ padding: '12px', border: '3px solid white' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentEmployees.map((employee, index) => (
                        <tr key={employee.id} style={{
                            backgroundColor: index % 2 === 0 ? '#E3F2FD' : '#BBDEFB',
                            fontSize: '1.1rem',
                            textAlign: 'center',
                            fontWeight: 'bold'
                        }}>
                            <td style={{ padding: '10px', border: '2px solid #007bff' }}>{employee.id}</td>
                            <td style={{ padding: '10px', border: '2px solid #007bff' }}>{employee.firstName}</td>
                            <td style={{ padding: '10px', border: '2px solid #007bff' }}>{employee.lastName}</td>
                            <td style={{ padding: '10px', border: '2px solid #007bff' }}>{employee.email}</td>
                            <td style={{ padding: '10px', border: '2px solid #007bff' }}>{employee.department}</td>
                            <td style={{ padding: '10px', border: '2px solid #007bff' }}>
                                <button 
                                    onClick={() => updateEmployee(employee.id)}
                                    className='btn btn-warning' 
                                    style={{ fontWeight: 'bold', color: 'white', marginRight: '5px' }}>
                                    ✏️ Update
                                </button>
                                <button 
                                    className='btn btn-danger' 
                                    onClick={() => removeEmployee(employee.id)}
                                    style={{ fontWeight: 'bold' }}>
                                    ❌ Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="d-flex justify-content-between mt-3">
                <button 
                    className="btn btn-primary" 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    ⬅️ Previous
                </button>
                
                <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                    Page {currentPage} of {totalPages}
                </span>

                <button 
                    className="btn btn-primary" 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next ➡️
                </button>
            </div>
        </div>
    );
}

export default ListEmployeeComponent;
