import React, { useEffect, useState } from 'react';
import { createDepartment, getDepartmentById, updateDepartment } from '../services/DepartmentService';
import { useNavigate, useParams } from 'react-router-dom';

const DepartmentComponent = () => {
  
  const [departmentName, setDepartmentName] = useState('');
  const [departmentDescription, setDepartmentDescription] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({}); // State for validation errors

  const { id } = useParams();
  const navigator = useNavigate();

  useEffect(() => {
    if (id) {
      getDepartmentById(id)
        .then((response) => {
          setDepartmentName(response.data.departmentName);
          setDepartmentDescription(response.data.departmentDescription);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, [id]);

  function validateForm() {
    let validationErrors = {};

    if (!departmentName.trim()) {
      validationErrors.departmentName = "Department Name is required.";
    } else if (departmentName.length < 3) {
      validationErrors.departmentName = "Department Name must be at least 3 characters long.";
    }

    if (!departmentDescription.trim()) {
      validationErrors.departmentDescription = "Department Description is required.";
    } else if (departmentDescription.length < 5) {
      validationErrors.departmentDescription = "Department Description must be at least 5 characters long.";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }

  function saveOrUpdateDepartment(e) {
    e.preventDefault();

    if (!validateForm()) return; // Stop execution if validation fails

    const department = { departmentName, departmentDescription };
    console.log(department);

    if (id) {
      updateDepartment(id, department)
        .then((response) => {
          console.log(response.data);
          setMessage('Record updated successfully!');
          setTimeout(() => {
            navigator('/departments');
          }, 1500);
        })
        .catch(error => {
          console.error(error);
        });
    } else {
      createDepartment(department)
        .then((response) => {
          console.log(response.data);
          setMessage('Record saved successfully!');
          setDepartmentName('');
          setDepartmentDescription('');
          setErrors({});
          setTimeout(() => {
            navigator('/departments');
          }, 1500);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }

  function pageTitle() {
    return id ? <h2 className='text-center' style={{ color: 'green', fontWeight: 'bold' }}>Update Department</h2> : <h2 className='text-center'>Add Department</h2>;
  }

  return (
    <div className='container'><br /><br />
      <div className='row'>
        <div className='card col-md-6 offset-md-3 offset-md-3'>
          {pageTitle()}

          <div className='card-body'>
            {message && <div className="alert alert-success">{message}</div>} {/* Success message */}

            <form>
              <div className='form-group mb-2'>
                <label className='form-label'>Department Name:</label>
                <input
                  type='text'
                  name='departmentName'
                  placeholder='Enter Department Name'
                  className={`form-control ${errors.departmentName ? 'is-invalid' : ''}`}
                  value={departmentName}
                  onChange={(e) => setDepartmentName(e.target.value)}
                />
                {errors.departmentName && <div className="invalid-feedback">{errors.departmentName}</div>}
              </div>

              <div className='form-group mb-2'>
                <label className='form-label'>Department Description:</label>
                <input
                  type='text'
                  name='departmentDescription'
                  placeholder='Enter Department Description'
                  className={`form-control ${errors.departmentDescription ? 'is-invalid' : ''}`}
                  value={departmentDescription}
                  onChange={(e) => setDepartmentDescription(e.target.value)}
                />
                {errors.departmentDescription && <div className="invalid-feedback">{errors.departmentDescription}</div>}
              </div>

              <button className='btn btn-success mb-2' onClick={saveOrUpdateDepartment}>Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DepartmentComponent;
