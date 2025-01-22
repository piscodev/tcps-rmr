'use client';
import { useState, useEffect } from "react";
import axios from "axios";

import Navbar from "components/adminNav";
import Footer from "components/Footer";

const AdminReportManagement = () => {
  const [reports, setReports] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [counts, setCounts] = useState({});

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get("/api/reports");
      setReports(response.data);

      const statusCounts = response.data.reduce((acc, report) => {
        acc[report.status] = (acc[report.status] || 0) + 1;
        return acc;
      }, {});

      setCounts(statusCounts);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`/api/reports/${id}`, { status: newStatus });
      fetchReports();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const deleteReport = async (id) => {
    try {
      await axios.delete(`/api/reports/${id}`);
      fetchReports();
    } catch (error) {
      console.error("Error deleting report:", error);
    }
  };

  const statuses = [
    "pending",
    "accepted",
    "on investigation",
    "dropped",
    "solved",
  ];

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="admin-report-management">
          <h1 className="header">Admin Report Management</h1>
          <div className="tabs">
            {statuses.map((status) => (
              <button
                key={status}
                className={`tab-button ${activeTab === status ? "active" : ""}`}
                onClick={() => setActiveTab(status)}
              >
                {status} <span className="badge">{counts[status] || 0}</span>
              </button>
            ))}
          </div>

          <div className="report-list">
            {reports
              .filter((report) => report.status === activeTab)
              .map((report) => (
                <div key={report.id} className="report-item">
                  <h3><strong>Reported by: {report.fullName}</strong></h3>
                  <p><strong>Reason:</strong> {report.reason}</p>
                  <p><strong>Status:</strong> {report.status}</p>
                  <div className="actions">
                    <select
                      value={report.status}
                      onChange={(e) => updateStatus(report.id, e.target.value)}
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <button onClick={() => deleteReport(report.id)} className="delete-btn">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <Footer />
      </div>

      <style jsx>{`
        .page-container {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        .admin-report-management {
          flex: 1;
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .header {
          font-family: "Georgia", serif;
          font-size: 2.5rem;
          color: #333;
          text-align: center;
          margin-bottom: 2rem;
        }

        .tabs {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .tab-button {
          padding: 0.5rem 1rem;
          border: none;
          background: lightgray;
          border-radius: 5px;
          cursor: pointer;
        }

        .tab-button.active {
          background: #0070f3;
          color: white;
        }

        .badge {
          background: red;
          color: white;
          border-radius: 50%;
          padding: 0.2rem 0.5rem;
          margin-left: 0.5rem;
        }

        .report-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .report-item {
          border: 1px solid #ccc;
          padding: 1rem;
          border-radius: 5px;
          background: #f9f9f9;
        }

        .actions {
          margin-top: 1rem;
          display: flex;
          gap: 1rem;
        }

        .delete-btn {
          background: red;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 5px;
          cursor: pointer;
        }

        footer {
          background: #f5f5f5;
          text-align: center;
          padding: 10px;
        }
      `}</style>
    </>
  );
};

export default AdminReportManagement;
