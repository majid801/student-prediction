
export interface Student {
  Student_ID: string;
  Gender: 'Male' | 'Female';
  Study_Hours_per_Week: number;
  Attendance_Rate: number;
  Past_Exam_Scores: number;
  Parental_Education_Level: string;
  Internet_Access_at_Home: 'Yes' | 'No';
  Extracurricular_Activities: 'Yes' | 'No';
  Final_Exam_Score: number;
  Pass_Fail: 'Pass' | 'Fail';
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  DATA_GRID = 'DATA_GRID',
  VISUALIZATIONS = 'VISUALIZATIONS',
  STUDENT_REPORT = 'STUDENT_REPORT',
  PREDICTOR = 'PREDICTOR',
  AI_INSIGHTS = 'AI_INSIGHTS',
  ABOUT = 'ABOUT'
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: any;
}

export interface RegressionResult {
  coefficients: { [key: string]: number };
  intercept: number;
  r2: number;
  equation: string;
}
