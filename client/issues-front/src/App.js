import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [issueTitle, setIssueTitle] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [listIssues, setListIssues] = useState([]);
  const [isUpdating, setIsUpdating] = useState('');
  const [updateIssueTitle, setUpdateIssueTitle] = useState('');
  const [updateIssueDescription, setUpdateIssueDescription] = useState('');
  const [error, setError] = useState('');

  const addIssue = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:9090/api/issue', { title: issueTitle, description: issueDescription })
      if (res.status === 200) {
        setError('')
        setListIssues(prev => [...prev, res.data]);
        setIssueTitle('');
        setIssueDescription('');
      }
    } catch (err) {
      setError(err.response.data.message);
    }
  }

  useEffect(() => {
    const getIssuesList = async () => {
      try {
        const res = await axios.get('http://localhost:9090/api/issues')
        setListIssues(res.data);
      } catch (err) {
        console.log(err);
        setError(err.response.data.message);
      }
    }
    getIssuesList()
  }, []);

  const deleteIssue = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:9090/api/issue/${id}`)
      if (res.status === 200) {
        setError('')
        const newListIssues = listIssues.filter(issue => issue._id !== id);
        setListIssues(newListIssues);
      }
    } catch (err) {
      console.log(err);
      setError(err.response.data.message);
    }
  }

  const updateIssue = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.put(`http://localhost:9090/api/issue/${isUpdating}`, { title: updateIssueTitle, description: updateIssueDescription })
      if (res.status === 200) {
        setError('')
        setListIssues(prev => {
          return prev.map(issue => {
            if (issue._id === isUpdating) {
              issue.title = updateIssueTitle
              issue.description = updateIssueDescription
            }
            return issue
          })
        });
        setUpdateIssueTitle('');
        setUpdateIssueDescription('');
        setIsUpdating('');
      }

    } catch (err) {
      console.log(err);
      setError(err.response.data.message);
    }
  }
  
  const renderUpdateForm = () => (
    <form className="update-form" onSubmit={(e) => { updateIssue(e) }} >
      <input className="update-new-input" type="text" placeholder="Title" onChange={e => { setUpdateIssueTitle(e.target.value) }} value={updateIssueTitle} />
      <input className="update-new-input" type="text" placeholder="Description" onChange={e => { setUpdateIssueDescription(e.target.value) }} value={updateIssueDescription} />
      <button className="update-new-btn" type="submit">Update</button>
    </form>
  )

  return (
    <div className="App">
      <h1>Issues</h1>
      <form className="form" onSubmit={e => addIssue(e)}>
        <input type="text" placeholder='Add title' onChange={e => { setIssueTitle(e.target.value) }} value={issueTitle} />
        <input type="text" placeholder='Add description' onChange={e => { setIssueDescription(e.target.value) }} value={issueDescription} />
        <button type="submit">Add</button>
      </form>
      <div className="error">{error}</div>
      <div className="listIssues">
        {
          listIssues.map(issue => (
            <div className="issue" id={issue._id}>
              {
                isUpdating === issue._id
                  ? renderUpdateForm()
                  : <>
                    <div className='col'>
                      <b>Title:</b>
                      <p className="issue-content">{issue.title}</p>
                    </div>
                    <div className='col'>
                      <b>description:</b>
                      <p className="issue-content">{issue.description}</p>
                    </div>
                    <div>
                      <button className="update-issue" onClick={() => {
                        setUpdateIssueTitle(issue.title);
                        setUpdateIssueDescription(issue.description);
                        setIsUpdating(issue._id);
                      }}>Update</button>
                      <button className="delete-issue" onClick={() => { deleteIssue(issue._id) }}>Delete</button>
                    </div>
                  </>
              }
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default App;