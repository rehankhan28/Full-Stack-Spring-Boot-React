import React, { useEffect, useState } from 'react';
import { deleteDepartment, getAllDepartments } from '../services/DepartmentService';
import { Link, useNavigate } from 'react-router-dom';

const ListDepartmentComponent = () => {
    const [departments, setDepartments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const departmentsPerPage = 3; // Max 3 records per page

    const navigator = useNavigate();

    useEffect(() => {
        listOfDepartments();
    }, []);

    function listOfDepartments() {
        getAllDepartments()
            .then((response) => {
                setDepartments(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }

    function updateDepartment(id) {
        if (window.confirm("Are you sure you want to update this department?")) {
            navigator(`/edit-department/${id}`);
        }
    }

    function removeDepartment(id) {
        if (window.confirm("Are you sure you want to delete this department?")) {
            deleteDepartment(id)
                .then(() => {
                    alert("Department deleted successfully!");
                    listOfDepartments();
                })
                .catch(error => {
                    console.error(error);
                    alert("Error deleting department!");
                });
        }
    }

    // Pagination Logic
    const indexOfLastDepartment = currentPage * departmentsPerPage;
    const indexOfFirstDepartment = indexOfLastDepartment - departmentsPerPage;
    const currentDepartments = departments.slice(indexOfFirstDepartment, indexOfLastDepartment);

    const totalPages = Math.ceil(departments.length / departmentsPerPage);

    return (
        <div className='container'>
            <h2 className='text-center' style={{ 
                color: '#2E7D32', 
                fontWeight: 'bold', 
                fontSize: '2rem', 
                textTransform: 'uppercase',
                letterSpacing: '2px',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' 
            }}>
                List of Departments
            </h2>

            <Link 
                to='/add-department' 
                className='btn mb-3' 
                style={{
                    backgroundColor: '#388E3C', 
                    color: 'white', 
                    fontWeight: 'bold',
                    letterSpacing: '1px',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    textDecoration: 'none',
                    display: 'inline-block'
                }}
            >
                ➕ Add Department
            </Link>

            {departments.length === 0 ? (
                <h4 className="text-center" style={{ color: 'red' }}>No Departments Available</h4>
            ) : (
                <>
                    <table className='table' style={{ 
                        border: '6px solid #2E7D32',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        width: '100%'
                    }}>
                        <thead>
                            <tr style={{ backgroundColor: '#1B5E20', color: 'white', fontSize: '1.2rem', textAlign: 'center' }}>
                                <th style={{ padding: '12px', border: '3px solid white' }}>Department Id</th>
                                <th style={{ padding: '12px', border: '3px solid white' }}>Department Name</th>
                                <th style={{ padding: '12px', border: '3px solid white' }}>Department Description</th>
                                <th style={{ padding: '12px', border: '3px solid white' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentDepartments.map((department, index) => (
                                <tr key={department.id} style={{
                                    backgroundColor: index % 2 === 0 ? '#C8E6C9' : '#A5D6A7',
                                    fontSize: '1.1rem',
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    transition: '0.3s',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#81C784'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#C8E6C9' : '#A5D6A7'}
                                >
                                    <td style={{ padding: '10px', border: '3px solid #1B5E20' }}>{department.id}</td>
                                    <td style={{ padding: '10px', border: '3px solid #1B5E20' }}>{department.departmentName}</td>
                                    <td style={{ padding: '10px', border: '3px solid #1B5E20' }}>{department.departmentDescription}</td>
                                    <td style={{ padding: '10px', border: '3px solid #1B5E20' }}>
                                        <button 
                                            onClick={() => updateDepartment(department.id)}
                                            className='btn btn-warning' 
                                            style={{ fontWeight: 'bold', color: 'white', marginRight: '5px' }}>
                                            ✏️ Update
                                        </button>
                                        <button 
                                            className='btn btn-danger' 
                                            onClick={() => removeDepartment(department.id)}
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
                </>
            )}
        </div>
    );
}

export default ListDepartmentComponent;