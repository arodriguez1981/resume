import React from 'react';

export const formatDate = (date: string): string => {
  if (!date) return '';
  
  try {
    const [year, month] = date.split('-');
    if (!year || !month || isNaN(parseInt(month)) || parseInt(month) < 1 || parseInt(month) > 12) {
      return date; // Return original if format is invalid
    }
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return date; // Return original on error
  }
};

export const formatBulletedText = (text: string): JSX.Element[] | string => {
  if (!text) return '';
  
  try {
    // Split by newlines and create React fragments
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line.trim()}
        {index < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  } catch (error) {
    console.error('Error formatting bulleted text:', error);
    return text; // Return original on error
  }
};