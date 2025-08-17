

import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:4000';

function Navbar({ token, role, logout }) {
  return (
    <nav style={{ background: '#2d3e50', color: 'white', padding: '10px 20px', marginBottom: 30, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 8 }}>
      <div style={{ fontWeight: 700, fontSize: 22 }}>Leave Management System</div>
      <div>
        {!token && <span style={{ marginRight: 20 }}>Welcome! Please log in.</span>}
        {token && (
          <>
            <span style={{ marginRight: 20 }}>Logged in as <b>{role}</b></span>
            <button onClick={logout} style={{ background: '#e74c3c', color: 'white', border: 'none', borderRadius: 4, padding: '6px 14px', cursor: 'pointer' }}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

function App() {
  // --- State ---
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [role, setRole] = useState(localStorage.getItem('role') || '');
  const [employeeId, setEmployeeId] = useState(localStorage.getItem('employeeId') || '');
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginResult, setLoginResult] = useState('');
  const [hrData, setHrData] = useState({ username: '', password: '' });
  const [hrResult, setHrResult] = useState('');
  const [empUserData, setEmpUserData] = useState({ username: '', password: '', employee_id: '' });
  const [empUserResult, setEmpUserResult] = useState('');
  const [addEmpData, setAddEmpData] = useState({ name: '', email: '', department: '', joining_date: '' });
  const [addEmpResult, setAddEmpResult] = useState('');
  const [leaveData, setLeaveData] = useState({ start_date: '', end_date: '', reason: '' });
  const [leaveResult, setLeaveResult] = useState('');
  const [leaveBalance, setLeaveBalance] = useState('');
  const [myLeaves, setMyLeaves] = useState([]);
  const [myLeavesMsg, setMyLeavesMsg] = useState('');
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [pendingMsg, setPendingMsg] = useState('');

  // --- Handlers and logic ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginResult('');
    try {
      const res = await fetch(API_BASE + '/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });
      const json = await res.json();
      if (res.ok) {
        setToken(json.token);
        setRole(json.role);
        setEmployeeId(json.employee || '');
        localStorage.setItem('token', json.token);
        localStorage.setItem('role', json.role);
        localStorage.setItem('employeeId', json.employee || '');
      } else {
        setLoginResult(json.error || 'Login failed');
      }
    } catch {
      setLoginResult('Network error');
    }
  };

  const logout = () => {
    setToken(''); setRole(''); setEmployeeId('');
    localStorage.clear();
  };

  const handleCreateHr = async (e) => {
    e.preventDefault();
    setHrResult('');
    try {
      const res = await fetch(API_BASE + '/auth/create-hr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hrData)
      });
      const json = await res.json();
      setHrResult(res.ok ? 'HR user created!' : (json.error || 'Error'));
    } catch { setHrResult('Network error'); }
  };

  const handleCreateEmpUser = async (e) => {
    e.preventDefault();
    setEmpUserResult('');
    try {
      const res = await fetch(API_BASE + '/auth/create-employee-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(empUserData)
      });
      const json = await res.json();
      setEmpUserResult(res.ok ? 'Employee user created!' : (json.error || 'Error'));
    } catch { setEmpUserResult('Network error'); }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    setAddEmpResult('');
    try {
      const res = await fetch(API_BASE + '/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify(addEmpData)
      });
      const json = await res.json();
      setAddEmpResult(res.ok ? 'Employee added! ID: ' + json._id : (json.error || 'Error'));
    } catch { setAddEmpResult('Network error'); }
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    setLeaveResult('');
    try {
      const res = await fetch(API_BASE + '/leaves/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ ...leaveData, employee_id: employeeId })
      });
      const json = await res.json();
      setLeaveResult(res.ok ? 'Leave applied! ID: ' + json._id : (json.error || 'Error'));
    } catch { setLeaveResult('Network error'); }
  };

  const handleCheckBalance = async () => {
    setLeaveBalance('');
    try {
      const res = await fetch(API_BASE + `/employees/${employeeId}/leave-balance`, {
        headers: { Authorization: 'Bearer ' + token }
      });
      const json = await res.json();
      setLeaveBalance(res.ok ? ('Leave Balance: ' + json.leave_balance) : (json.error || 'Error'));
    } catch { setLeaveBalance('Network error'); }
  };

  const loadMyLeaves = async () => {
    setMyLeavesMsg('');
    try {
      const res = await fetch(API_BASE + `/leaves/my`, {
        headers: { Authorization: 'Bearer ' + token }
      });
      const leaves = await res.json();
      if (!Array.isArray(leaves)) { setMyLeavesMsg('Error loading leaves.'); setMyLeaves([]); return; }
      setMyLeaves(leaves);
      if (leaves.length === 0) setMyLeavesMsg('No leave requests.');
    } catch { setMyLeavesMsg('Network error'); setMyLeaves([]); }
  };

  const loadPendingLeaves = async () => {
    setPendingMsg('');
    try {
      const res = await fetch(API_BASE + '/leaves/pending', {
        headers: { Authorization: 'Bearer ' + token }
      });
      const leaves = await res.json();
      if (!Array.isArray(leaves)) { setPendingMsg('Error loading leaves.'); setPendingLeaves([]); return; }
      setPendingLeaves(leaves);
      if (leaves.length === 0) setPendingMsg('No pending leave requests.');
    } catch { setPendingMsg('Network error'); setPendingLeaves([]); }
  };

  const handleApprove = async (id) => {
    try {
      const res = await fetch(API_BASE + `/leaves/${id}/approve`, { method: 'POST', headers: { Authorization: 'Bearer ' + token } });
      const json = await res.json();
      alert(json.message || json.error || 'Done');
      loadPendingLeaves();
    } catch { alert('Network error'); }
  };
  const handleReject = async (id) => {
    try {
      const res = await fetch(API_BASE + `/leaves/${id}/reject`, { method: 'POST', headers: { Authorization: 'Bearer ' + token } });
      const json = await res.json();
      alert(json.message || json.error || 'Done');
      loadPendingLeaves();
    } catch { alert('Network error'); }
  };

  useEffect(() => {
    if (token && role === 'hr') loadPendingLeaves();
    if (token && role === 'employee') loadMyLeaves();
  }, [token, role]);

  // --- UI ---
  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'Segoe UI, Arial, sans-serif', background: '#f8f9fa', borderRadius: 10, boxShadow: '0 2px 12px #0001', padding: 0 }}>
      <Navbar token={token} role={role} logout={logout} />
      <div style={{ padding: 32 }}>
        {!token && (
          <div className="section">
            <h2 style={{ color: '#2d3e50' }}>Login</h2>
            <form onSubmit={handleLogin} style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', marginBottom: 8 }}>Username:<br />
                <input type="text" value={loginData.username} onChange={e => setLoginData({ ...loginData, username: e.target.value })} required style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
              </label>
              <label style={{ display: 'block', marginBottom: 8 }}>Password:<br />
                <input type="password" value={loginData.password} onChange={e => setLoginData({ ...loginData, password: e.target.value })} required style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
              </label>
              <button type="submit" style={{ background: '#2d3e50', color: 'white', border: 'none', borderRadius: 4, padding: '8px 20px', cursor: 'pointer', marginTop: 8 }}>Login</button>
              <div className="result" style={{ color: 'crimson', marginTop: 8 }}>{loginResult}</div>
            </form>
            <hr />
            <h3 style={{ color: '#2d3e50' }}>Create HR User</h3>
            <form onSubmit={handleCreateHr} style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', marginBottom: 8 }}>Username:<br />
                <input type="text" value={hrData.username} onChange={e => setHrData({ ...hrData, username: e.target.value })} required style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
              </label>
              <label style={{ display: 'block', marginBottom: 8 }}>Password:<br />
                <input type="password" value={hrData.password} onChange={e => setHrData({ ...hrData, password: e.target.value })} required style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
              </label>
              <button type="submit" style={{ background: '#2980b9', color: 'white', border: 'none', borderRadius: 4, padding: '8px 20px', cursor: 'pointer', marginTop: 8 }}>Create HR</button>
              <div className="result" style={{ color: 'green', marginTop: 8 }}>{hrResult}</div>
            </form>
            <hr />
            <h3 style={{ color: '#2d3e50' }}>Create Employee User</h3>
            <form onSubmit={handleCreateEmpUser}>
              <label style={{ display: 'block', marginBottom: 8 }}>Username:<br />
                <input type="text" value={empUserData.username} onChange={e => setEmpUserData({ ...empUserData, username: e.target.value })} required style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
              </label>
              <label style={{ display: 'block', marginBottom: 8 }}>Password:<br />
                <input type="password" value={empUserData.password} onChange={e => setEmpUserData({ ...empUserData, password: e.target.value })} required style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
              </label>
              <label style={{ display: 'block', marginBottom: 8 }}>Employee ID:<br />
                <input type="text" value={empUserData.employee_id} onChange={e => setEmpUserData({ ...empUserData, employee_id: e.target.value })} required style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
              </label>
              <button type="submit" style={{ background: '#27ae60', color: 'white', border: 'none', borderRadius: 4, padding: '8px 20px', cursor: 'pointer', marginTop: 8 }}>Create Employee User</button>
              <div className="result" style={{ color: 'green', marginTop: 8 }}>{empUserResult}</div>
            </form>
          </div>
        )}
        {token && role === 'employee' && (
          <div id="employeeSection">
            <div className="section">
              <h2 style={{ color: '#2d3e50' }}>Apply for Leave</h2>
              <form onSubmit={handleApplyLeave} style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', marginBottom: 8 }}>Start Date:<br />
                  <input type="date" value={leaveData.start_date} onChange={e => setLeaveData({ ...leaveData, start_date: e.target.value })} required style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
                </label>
                <label style={{ display: 'block', marginBottom: 8 }}>End Date:<br />
                  <input type="date" value={leaveData.end_date} onChange={e => setLeaveData({ ...leaveData, end_date: e.target.value })} required style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
                </label>
                <label style={{ display: 'block', marginBottom: 8 }}>Reason:<br />
                  <input type="text" value={leaveData.reason} onChange={e => setLeaveData({ ...leaveData, reason: e.target.value })} style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
                </label>
                <button type="submit" style={{ background: '#2d3e50', color: 'white', border: 'none', borderRadius: 4, padding: '8px 20px', cursor: 'pointer', marginTop: 8 }}>Apply</button>
                <div className="result" style={{ color: leaveResult.startsWith('Leave applied') ? 'green' : 'crimson', marginTop: 8 }}>{leaveResult}</div>
              </form>
            </div>
            <div className="section">
              <h2 style={{ color: '#2d3e50' }}>Check Leave Balance</h2>
              <button onClick={handleCheckBalance} style={{ background: '#2980b9', color: 'white', border: 'none', borderRadius: 4, padding: '8px 20px', cursor: 'pointer', marginBottom: 8 }}>Check Balance</button>
              <div className="result" style={{ color: 'green', marginTop: 8 }}>{leaveBalance}</div>
            </div>
            <div className="section">
              <h2 style={{ color: '#2d3e50' }}>My Leave Requests</h2>
              <button onClick={loadMyLeaves} style={{ background: '#27ae60', color: 'white', border: 'none', borderRadius: 4, padding: '8px 20px', cursor: 'pointer', marginBottom: 8 }}>Refresh List</button>
              {myLeavesMsg && <div className="result" style={{ color: 'crimson', marginTop: 8 }}>{myLeavesMsg}</div>}
              {myLeaves.length > 0 && (
                <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: 6, boxShadow: '0 1px 4px #0001' }}>
                  <thead style={{ background: '#2d3e50', color: 'white' }}><tr><th>ID</th><th>Dates</th><th>Status</th><th>Reason</th></tr></thead>
                  <tbody>
                    {myLeaves.map(l => (
                      <tr key={l._id} style={{ borderBottom: '1px solid #eee' }}>
                        <td>{l._id}</td>
                        <td>{l.start_date?.slice(0,10)} to {l.end_date?.slice(0,10)}</td>
                        <td>{l.status}</td>
                        <td>{l.reason || ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
        {token && role === 'hr' && (
          <div id="hrSection">
            <div className="section">
              <h2 style={{ color: '#2d3e50' }}>Add Employee</h2>
              <form onSubmit={handleAddEmployee} style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', marginBottom: 8 }}>Name:<br />
                  <input type="text" value={addEmpData.name} onChange={e => setAddEmpData({ ...addEmpData, name: e.target.value })} required style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
                </label>
                <label style={{ display: 'block', marginBottom: 8 }}>Email:<br />
                  <input type="email" value={addEmpData.email} onChange={e => setAddEmpData({ ...addEmpData, email: e.target.value })} required style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
                </label>
                <label style={{ display: 'block', marginBottom: 8 }}>Department:<br />
                  <input type="text" value={addEmpData.department} onChange={e => setAddEmpData({ ...addEmpData, department: e.target.value })} required style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
                </label>
                <label style={{ display: 'block', marginBottom: 8 }}>Joining Date:<br />
                  <input type="date" value={addEmpData.joining_date} onChange={e => setAddEmpData({ ...addEmpData, joining_date: e.target.value })} required style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
                </label>
                <button type="submit" style={{ background: '#2d3e50', color: 'white', border: 'none', borderRadius: 4, padding: '8px 20px', cursor: 'pointer', marginTop: 8 }}>Add Employee</button>
                <div className="result" style={{ color: addEmpResult.startsWith('Employee added') ? 'green' : 'crimson', marginTop: 8 }}>{addEmpResult}</div>
              </form>
            </div>
            <div className="section">
              <h2 style={{ color: '#2d3e50' }}>Pending Leave Requests</h2>
              <button onClick={loadPendingLeaves} style={{ background: '#27ae60', color: 'white', border: 'none', borderRadius: 4, padding: '8px 20px', cursor: 'pointer', marginBottom: 8 }}>Refresh List</button>
              {pendingMsg && <div className="result" style={{ color: 'crimson', marginTop: 8 }}>{pendingMsg}</div>}
              {pendingLeaves.length > 0 && (
                <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: 6, boxShadow: '0 1px 4px #0001' }}>
                  <thead style={{ background: '#2d3e50', color: 'white' }}><tr><th>ID</th><th>Employee</th><th>Dates</th><th>Reason</th><th>Action</th></tr></thead>
                  <tbody>
                    {pendingLeaves.map(l => (
                      <tr key={l._id} style={{ borderBottom: '1px solid #eee' }}>
                        <td>{l._id}</td>
                        <td>{l.employee_id?.name || ''} <br /><small>{l.employee_id?.email || ''}</small></td>
                        <td>{l.start_date?.slice(0,10)} to {l.end_date?.slice(0,10)}</td>
                        <td>{l.reason || ''}</td>
                        <td>
                          <button onClick={() => handleApprove(l._id)} style={{ background: '#2980b9', color: 'white', border: 'none', borderRadius: 4, padding: '6px 12px', cursor: 'pointer', marginRight: 6 }}>Approve</button>
                          <button onClick={() => handleReject(l._id)} style={{ background: '#e74c3c', color: 'white', border: 'none', borderRadius: 4, padding: '6px 12px', cursor: 'pointer' }}>Reject</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
