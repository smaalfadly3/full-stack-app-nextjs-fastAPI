"use client"; // This ensures the file is treated as a client-side component.

import { useContext, useState, useEffect } from 'react';
import AuthContext from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import axios from 'axios';

const Home = () => {
  const { user, logout } = useContext(AuthContext); // Access user and logout function from AuthContext.
  const [workouts, setWorkouts] = useState([]); // State for storing workouts.
  const [routines, setRoutines] = useState([]); // State for storing routines.
  const [workoutName, setWorkoutName] = useState(''); // State for workout name input.
  const [workoutDescription, setWorkoutDescription] = useState(''); // State for workout description input.
  const [routineName, setRoutineName] = useState(''); // State for routine name input.
  const [routineDescription, setRoutineDescription] = useState(''); // State for routine description input.
  const [selectedWorkouts, setSelectedWorkouts] = useState([]); // State for selected workouts.
  const [token, setToken] = useState(null); // State to store the token.

  useEffect(() => {
    // This effect will only run on the client side.
    const storedToken = localStorage.getItem('token'); // Retrieve the token from localStorage.
    setToken(storedToken); // Set the token in state.
  }, []); // Empty dependency array ensures this effect runs only once after the component mounts.

  useEffect(() => {
    if (token) {
      // Fetch workouts and routines only if the token is available.
      const fetchWorkoutsAndRoutines = async () => {
        try {
          const [workoutsResponse, routinesResponse] = await Promise.all([
            axios.get('http://localhost:8000/workouts/workouts', {
              headers: { Authorization: `Bearer ${token}` }, // Pass the token in the Authorization header.
            }),
            axios.get('http://localhost:8000/routines', {
              headers: { Authorization: `Bearer ${token}` }, // Pass the token in the Authorization header.
            }),
          ]);

          setWorkouts(workoutsResponse.data); // Set the retrieved workouts.
          setRoutines(routinesResponse.data); // Set the retrieved routines.
        } catch (error) {
          console.error('Failed to fetch data:', error); // Handle errors.
        }
      };

      fetchWorkoutsAndRoutines(); // Call the function to fetch data.
    }
  }, [token]); // Re-run this effect when the token changes.

  const handleCreateWorkout = async (e) => {
    e.preventDefault(); // Prevent form submission from reloading the page.
    try {
      const response = await axios.post('http://localhost:8000/workouts', {
        name: workoutName,
        description: workoutDescription,
      });
      setWorkouts([...workouts, response.data]); // Add the new workout to the existing list.
      setWorkoutName(''); // Reset the workout name input.
      setWorkoutDescription(''); // Reset the workout description input.
    } catch (error) {
      console.error('Failed to create workout:', error); // Handle errors.
    }
  };

  const handleCreateRoutine = async (e) => {
    e.preventDefault(); // Prevent form submission from reloading the page.
    try {
      const response = await axios.post('http://localhost:8000/routines', {
        name: routineName,
        description: routineDescription,
        workouts: selectedWorkouts,
      });
      setRoutineName(''); // Reset the routine name input.
      setRoutineDescription(''); // Reset the routine description input.
      setSelectedWorkouts([]); // Clear the selected workouts.
    } catch (error) {
      console.error('Failed to create routine:', error); // Handle errors.
    }
  };

  return (
    <ProtectedRoute>
      <div className="container">
        <h1>Welcome!</h1>
        <button onClick={logout} className="btn btn-danger">Logout</button>

        {/* Forms for creating workouts and routines */}
        <div className="accordion mt-5 mb-5" id="accordionExample">
          {/* Create Workout */}
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingOne">
              <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                Create Workout
              </button>
            </h2>
            <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
              <div className="accordion-body">
                <form onSubmit={handleCreateWorkout}>
                  <div className="mb-3">
                    <label htmlFor="workoutName" className="form-label">Workout Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="workoutName"
                      value={workoutName}
                      onChange={(e) => setWorkoutName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="workoutDescription" className="form-label">Workout Description</label>
                    <input
                      type="text"
                      className="form-control"
                      id="workoutDescription"
                      value={workoutDescription}
                      onChange={(e) => setWorkoutDescription(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Create Workout</button>
                </form>
              </div>
            </div>
          </div>

          {/* Create Routine */}
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingTwo">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                Create Routine
              </button>
            </h2>
            <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
              <div className="accordion-body">
                <form onSubmit={handleCreateRoutine}>
                  <div className="mb-3">
                    <label htmlFor="routineName" className="form-label">Routine Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="routineName"
                      value={routineName}
                      onChange={(e) => setRoutineName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="routineDescription" className="form-label">Routine Description</label>
                    <input
                      type="text"
                      className="form-control"
                      id="routineDescription"
                      value={routineDescription}
                      onChange={(e) => setRoutineDescription(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="workoutSelect" className="form-label">Select Workouts</label>
                    <select
                      multiple
                      className="form-control"
                      id="workoutSelect"
                      value={selectedWorkouts}
                      onChange={(e) => setSelectedWorkouts([...e.target.selectedOptions].map(option => option.value))}
                    >
                      {workouts.map(workout => (
                        <option key={workout.id} value={workout.id}>
                          {workout.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary">Create Routine</button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Displaying Routines */}
        <div>
          <h3>Your routines:</h3>
          <ul>
            {routines.map(routine => (
              <div className="card" key={routine.id}>
                <div className="card-body">
                  <h5 className="card-title">{routine.name}</h5>
                  <p className="card-text">{routine.description}</p>
                  <ul className="card-text"> 
                    {routine.workouts && routine.workouts.map(workout => (
                      <li key={workout.id}>
                        {workout.name}: {workout.description}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </ul>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Home;
