import { GoogleGenAI } from "@google/genai";
import { Student } from '../types';

const getAiClient = () => {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// Summarize data to reduce context size for the LLM
const getContextSummary = (students: Student[]) => {
    const total = students.length;
    const passed = students.filter(s => s.Pass_Fail === 'Pass').length;
    const avgScore = students.reduce((acc, s) => acc + s.Final_Exam_Score, 0) / total;
    
    // Sample a few rows
    const sample = students.slice(0, 5);

    return `
    Dataset Summary:
    Total Students: ${total}
    Pass Rate: ${((passed / total) * 100).toFixed(1)}%
    Average Final Score: ${avgScore.toFixed(1)}
    
    Columns: Student_ID, Gender, Study_Hours_per_Week, Attendance_Rate, Past_Exam_Scores, Parental_Education_Level, Internet_Access_at_Home, Extracurricular_Activities, Final_Exam_Score, Pass_Fail.
    
    Sample Data JSON:
    ${JSON.stringify(sample)}
    `;
};

export const generateInsight = async (question: string, students: Student[]): Promise<string> => {
    try {
        const ai = getAiClient();
        const context = getContextSummary(students);
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are a data analyst expert for a student performance dashboard. 
            The user is asking a question about a dataset of student performance.
            
            Context about the data:
            ${context}
            
            User Question: "${question}"
            
            Provide a concise, professional answer based on the context provided. If the question requires specific calculations not present in the summary, explain the likely trend based on general educational data knowledge or ask for more specific data cuts. Keep the tone helpful and analytical.`,
        });
        
        return response.text || "I couldn't generate an insight at this time.";
    } catch (error) {
        console.error("Gemini Insight Error:", error);
        return "Sorry, I encountered an error while analyzing the data.";
    }
};

export const predictOutcome = async (studentData: Partial<Student>): Promise<{ prediction: string; confidence: string; reasoning: string }> => {
    try {
        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Act as a predictive model for student success. Based on the following student profile, predict if they will Pass or Fail the final exam.
            
            Student Profile:
            - Study Hours/Week: ${studentData.Study_Hours_per_Week}
            - Attendance Rate: ${studentData.Attendance_Rate}%
            - Past Exam Scores: ${studentData.Past_Exam_Scores}
            - Parental Education: ${studentData.Parental_Education_Level}
            - Internet Access: ${studentData.Internet_Access_at_Home}
            - Extracurriculars: ${studentData.Extracurricular_Activities}
            
            Return ONLY a JSON object with this structure (no markdown formatting):
            {
              "prediction": "Pass" or "Fail",
              "confidence": "High" or "Medium" or "Low",
              "reasoning": "A short sentence explaining why."
            }`,
             config: {
                responseMimeType: "application/json"
             }
        });
        
        const text = response.text || "{}";
        return JSON.parse(text);
    } catch (error) {
        console.error("Prediction Error:", error);
        return { prediction: "Error", confidence: "Low", reasoning: "Could not connect to prediction service." };
    }
};
