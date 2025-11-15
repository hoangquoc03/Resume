import React from "react";
import ClassicTemplate from './tem'
const ResumePreview = ({ data, template, accentColor, classes = "" }) => {
    const renderTemplate =()=>{
        switch (template) {
            case "modern":
                return <
                break;
            
        }
    }
  return (
    <div className="w-full bg-gray-100">
      <div
        id="resume-preview"
        className={
          "border border-gray-200 print:shadow-none print:border-none" + classes
        }
      ></div>
    </div>
  );
};

export default ResumePreview;
