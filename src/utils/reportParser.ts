import type { FieldReport } from '../services/report.service';
import { APP_STRINGS } from '../constants/strings';

export function parseReportData(report: FieldReport) {
  const employeeData = Array.isArray(report.employees) ? report.employees[0] : report.employees;
  const reporterName = employeeData?.full_name || employeeData?.email?.split('@')[0] || APP_STRINGS.MAP.UNKNOWN_REPORTER;
  
  const zoneName = Array.isArray(report.zones) ? report.zones[0]?.name : report.zones?.name;
  const severity = Array.isArray(report.report_categories) ? report.report_categories[0]?.severity_level : report.report_categories?.severity_level;
  const categoryName = Array.isArray(report.report_categories) ? report.report_categories[0]?.name : report.report_categories?.name;

  return { employeeData, reporterName, zoneName, severity, categoryName };
}

export function parseLatestCommentData(report: FieldReport) {
  if (!report.report_comments || report.report_comments.length === 0) return null;
  
  const latestComment = report.report_comments[report.report_comments.length - 1];
  const commentEmployee = Array.isArray(latestComment.employees) ? (latestComment.employees as { full_name: string }[])[0] : (latestComment.employees as { full_name: string });
  const commenterName = commentEmployee?.full_name || APP_STRINGS.MAP.SYSTEM;
  
  return { content: latestComment.content, commenterName };
}
