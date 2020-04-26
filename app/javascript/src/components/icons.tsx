import React from 'react'

// Fonts SVG come from FontAwesome Free Solid Icons
// https://fontawesome.com/license

export const ExclamationTriangle = (props) => {
  let {className,...otherProps} = props;
  className = 'icon flash ' + className
  return (
    <svg viewBox="0 0 576 512" className={className} {...otherProps} color="red">
      <path fill="currentColor" d='M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z' />
    </svg>
  )
}

export const Circle = (props) => {
  let {className,...otherProps} = props;
  className = 'icon ' + className
  return (
    <svg viewBox="0 0 512 512" className={className} {...otherProps} color="limeGreen">
      <path fill="currentColor" d='M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z' />
    </svg>
  )
}

export const Spinner = (props) => {
  let {className,...otherProps} = props;
  className = 'icon spin ' + className
  return (
    <svg viewBox="0 0 512 512" className={className} {...otherProps}>
      <path fill="currentColor" d='M304 48c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-48 368c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zm208-208c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zM96 256c0-26.51-21.49-48-48-48S0 229.49 0 256s21.49 48 48 48 48-21.49 48-48zm12.922 99.078c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.491-48-48-48zm294.156 0c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.49-48-48-48zM108.922 60.922c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.491-48-48-48z' />
    </svg>
  )
}

export const Question = (props) => {
  let {className,...otherProps} = props;
  className = 'icon ' + className
  return (
    <svg viewBox="0 0 384 512" className={className} {...otherProps} color="gray">
      <path fill="currentColor" d='M202.021 0C122.202 0 70.503 32.703 29.914 91.026c-7.363 10.58-5.093 25.086 5.178 32.874l43.138 32.709c10.373 7.865 25.132 6.026 33.253-4.148 25.049-31.381 43.63-49.449 82.757-49.449 30.764 0 68.816 19.799 68.816 49.631 0 22.552-18.617 34.134-48.993 51.164-35.423 19.86-82.299 44.576-82.299 106.405V320c0 13.255 10.745 24 24 24h72.471c13.255 0 24-10.745 24-24v-5.773c0-42.86 125.268-44.645 125.268-160.627C377.504 66.256 286.902 0 202.021 0zM192 373.459c-38.196 0-69.271 31.075-69.271 69.271 0 38.195 31.075 69.27 69.271 69.27s69.271-31.075 69.271-69.271-31.075-69.27-69.271-69.27z' />
    </svg>
  )
}
