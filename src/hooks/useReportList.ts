import { useState, useMemo, useEffect } from 'react';
import { format } from 'date-fns';
import { useReports } from './useReports';
import type { FieldReport } from '../services/report.service';
import { parseReportData } from '../utils/reportParser';
import { APP_CONFIG } from '../constants/config';

export function useReportList() {
  const { data: reports = [], isLoading } = useReports();
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState<string>('');
  const [selectedReport, setSelectedReport] = useState<FieldReport | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = APP_CONFIG.UI.ITEMS_PER_PAGE;

  const filteredReports = useMemo(() => {
    return reports.filter((report: FieldReport) => {
      const matchStatus = filterStatus === 'ALL' || report.status === filterStatus;
      const { reporterName, zoneName } = parseReportData(report);
      const notes = report.notes || '';
      const searchStr = searchQuery.toLowerCase();
      const matchSearch = !searchQuery || reporterName.toLowerCase().includes(searchStr) || (zoneName || '').toLowerCase().includes(searchStr) || notes.toLowerCase().includes(searchStr);
      const matchDate = !filterDate || (report.created_at ? format(new Date(report.created_at), 'yyyy-MM-dd') === filterDate : false);
      return matchStatus && matchSearch && matchDate;
    });
  }, [reports, filterStatus, searchQuery, filterDate]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setCurrentPage(1); }, [filterStatus, searchQuery, filterDate]);
  useEffect(() => {
    if (selectedReport) {
      const updated = reports.find((r: FieldReport) => r.id === selectedReport.id);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (updated && updated !== selectedReport) setSelectedReport(updated);
    }
  }, [reports, selectedReport]);

  return {
    isLoading, filterStatus, setFilterStatus, searchQuery, setSearchQuery,
    filterDate, setFilterDate, selectedReport, setSelectedReport,
    currentPage, setCurrentPage, itemsPerPage,
    totalPages: Math.ceil(filteredReports.length / itemsPerPage), 
    paginatedReports: filteredReports.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), 
    totalFiltered: filteredReports.length
  };
}
