import React, { useState } from 'react';
import { DataStore } from '../../services/dataStore';
import { AdminLog } from '../../types';
import { 
  Activity, 
  Search, 
  Filter, 
  ShieldCheck, 
  Calendar, 
  User, 
  Clock, 
  CheckCircle2, 
  FileText,
  Trash2
} from 'lucide-react';

export const AdminActivityPage: React.FC = () => {
  const [logs, setLogs] = useState<AdminLog[]>(DataStore.getAdminLogs());
  const [searchTerm, setSearchTerm] = useState('');
  const [targetTypeFilter, setTargetTypeFilter] = useState<string>('all');

  const filteredLogs = logs.filter(log => {
    const matchSearch = 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.adminEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.targetId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchTarget = targetTypeFilter === 'all' || log.targetType === targetTypeFilter;

    return matchSearch && matchTarget;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#061A4F]">Administrative Audit Trail</h1>
          <p className="text-xs text-slate-500 mt-1">
            Immutable system activity log recording all staff approvals, verifications, suspensions, and changes.
          </p>
        </div>
        <div className="text-xs font-bold text-slate-500 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
          Total Logged Actions: <strong className="text-[#061A4F]">{logs.length}</strong>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search audit trail by action, admin email, details, or target ID..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={targetTypeFilter}
              onChange={(e) => setTargetTypeFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
            >
              <option value="all">All Target Entity Types</option>
              <option value="user">User</option>
              <option value="service">Service</option>
              <option value="job">Job</option>
              <option value="category">Category</option>
              <option value="payout">Payout</option>
              <option value="platform_settings">Platform Settings</option>
            </select>
          </div>

        </div>
      </div>

      {/* Activity Stream */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-slate-50/70 transition flex items-start gap-4">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#061A4F] flex items-center justify-center flex-shrink-0 mt-0.5 border border-blue-100">
                  <Activity className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-[#061A4F] text-white font-mono text-[10px] font-bold rounded">
                        {log.action}
                      </span>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded uppercase">
                        {log.targetType} • {log.targetId}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-800 font-medium leading-relaxed">
                    {log.details}
                  </p>
                  <div className="text-[11px] text-slate-400">
                    Staff Actor: <strong className="text-slate-600">{log.adminEmail}</strong>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              No matching activity log entries found.
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
