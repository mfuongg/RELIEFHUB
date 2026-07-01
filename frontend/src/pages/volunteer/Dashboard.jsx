import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import PageTransition from '../../components/PageTransition';
import {
  Clock, CheckCircle2, Users, ClipboardList, MapPin, Calendar,
  UserPlus, FileText, AlertCircle, ChevronRight, Activity
} from 'lucide-react';

export default function VolunteerDashboard() {
  const { user, volunteerGroups, missions, missionReports } = useApp();
  const myGroup = volunteerGroups.find(g => g.memberIds?.includes(user?.id));
  const myMissions = missions.filter(m => myGroup && m.assignedGroupId === myGroup.id);
  const myReports = missionReports.filter(r => r.authorId === user?.id);
  const openMissions = missions.filter(m => m.status === 'OPEN');

  return (
    <PageTransition>
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Chào mừng, {user?.name}! 🙋</h1>
          <p className="text-sm text-gray-500">Tình nguyện viên ReliefHub</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Nhóm của tôi', value: myGroup ? myGroup.name : 'Chưa có', icon: <Users className="w-5 h-5" />, color: 'bg-rose-100 text-rose-600' },
            { label: 'Nhiệm vụ', value: myMissions.length, icon: <ClipboardList className="w-5 h-5" />, color: 'bg-blue-100 text-blue-600' },
            { label: 'Hoàn thành', value: myMissions.filter(m => m.status === 'COMPLETED').length, icon: <CheckCircle2 className="w-5 h-5" />, color: 'bg-emerald-100 text-emerald-600' },
            { label: 'Báo cáo', value: myReports.length, icon: <FileText className="w-5 h-5" />, color: 'bg-amber-100 text-amber-600' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="bg-white rounded-2xl p-4 shadow-card border border-gray-100">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>{s.icon}</div>
              <div className="text-lg font-bold text-gray-800 truncate">{s.value}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Quick links */}
        <div className="grid md:grid-cols-3 gap-4">
          <Link to="/dashboard/volunteer/groups" className="bg-white rounded-2xl shadow-card border border-gray-100 p-5 hover:shadow-card-hover no-underline group">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center"><UserPlus className="w-6 h-6" /></div>
              <div className="flex-1"><div className="font-bold text-gray-800 text-sm">Nhóm tình nguyện</div><div className="text-xs text-gray-500">Tham gia hoặc tạo nhóm</div></div>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-rose-400" />
            </div>
          </Link>
          <Link to="/dashboard/volunteer/missions" className="bg-white rounded-2xl shadow-card border border-gray-100 p-5 hover:shadow-card-hover no-underline group">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center"><ClipboardList className="w-6 h-6" /></div>
              <div className="flex-1"><div className="font-bold text-gray-800 text-sm">Nhiệm vụ cứu trợ</div><div className="text-xs text-gray-500">{openMissions.length} nhiệm vụ đang mở</div></div>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-400" />
            </div>
          </Link>
          <Link to="/dashboard/volunteer/report" className="bg-white rounded-2xl shadow-card border border-gray-100 p-5 hover:shadow-card-hover no-underline group">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center"><FileText className="w-6 h-6" /></div>
              <div className="flex-1"><div className="font-bold text-gray-800 text-sm">Báo cáo hoạt động</div><div className="text-xs text-gray-500">Gửi báo cáo nhiệm vụ</div></div>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-amber-400" />
            </div>
          </Link>
        </div>

        {/* My missions */}
        {myGroup && myMissions.length > 0 && (
          <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-5">
            <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-rose-500" />Nhiệm vụ của nhóm</h2>
            <div className="space-y-3">
              {myMissions.map(m => (
                <div key={m.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <div className="text-xs font-mono text-gray-400">{m.code}</div>
                    <div className="font-medium text-sm text-gray-800">{m.title}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{m.location}</div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${m.status === 'COMPLETED' ? 'bg-gray-100 text-gray-600' : m.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-700' : m.status === 'ASSIGNED' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {m.status === 'COMPLETED' ? 'Hoàn thành' : m.status === 'IN_PROGRESS' ? 'Đang làm' : m.status === 'ASSIGNED' ? 'Đã giao' : 'Mở'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Open missions */}
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-5">
          <h2 className="font-bold text-gray-800 mb-4">Nhiệm vụ đang mở</h2>
          {openMissions.length === 0 ? <p className="text-center text-gray-400 text-sm py-4">Không có nhiệm vụ nào đang mở</p> : (
            <div className="space-y-3">
              {openMissions.slice(0, 3).map(m => (
                <div key={m.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <div className="text-xs font-mono text-gray-400">{m.code}</div>
                    <div className="font-medium text-sm text-gray-800">{m.title}</div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{m.location}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{m.requiredPeople} người</span>
                    </div>
                  </div>
                  <Link to="/dashboard/volunteer/missions" className="text-xs text-rose-500 border border-rose-200 px-3 py-1.5 rounded-lg hover:bg-rose-50">Xem</Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
