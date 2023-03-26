# Data Collector


<h3>How it's build</h3>
 <ul>
  <li>UI developed using <b>Html, Css and Bootstrap</b>.</li>
  <li><b>Nodejs</b> is used to develop backend of the website.</li>
  <li>Added functionalities using <b>JS</b>.</li>
  <li>You can check it here: <a href="https://misty-cod-belt.cyclic.app/">Data Collector</a>.</li>
  <li><b>MongoDB</b> is used for data storage.</li>
 </ul>
 
 
 
 
 <h3>Features</h3>
<ul>
  <li>Realtime data collection can be done.</li>
  <li>Having responsive UI.</li>
  <li>You can login via credentials or <b>OAuth using google</b>.</li>
  <li>Create your form and share it with anyone.</li>
  <li>You can add mcq and short text questions.</li>
 </ul>
 
 <h3>Get And Post Requests</h3>
<ul>
  <li><b>Get(/):</b> Rendering Home Page.</li>
   <li><b>Get(/login):</b> Rendering Login Page.</li>
   <li><b>Post(/login):</b> Validating user credentials to login in app.</li>
   <li><b>Get(/register):</b> Rendering Register Page.</li>
   <li><b>Post(/register):</b> Storing user data in DB and then redirecting him to dashboard.</li>
   <li><b>Get(/auth/google):</b> Helping user to sign-up using google account.</li>
   <li><b>Get(/logout):</b> Making user logout from web-app and redirecting to home.</li>
   <li><b>Get(/dashboard):</b> Rendering dashboard Page to user and displaying his all forms.</li>
   <li><b>Get(/dashboard/create):</b> This Get request creates a new form and redirects to create page.</li>
   <li><b>Get(/:userId/:formId):</b> When user makes his form public for collecting data then this get request helps to render form to any end user willing to fill form.</li>
   <li><b>Post(/:userId/:formId):</b> It helps to collect response of any end user who submitted the form, before saving response it also validates whether form is accepting response or not, if accepts then it render Thanks page else No longer accepting responses page.</li>
   <li><b>Get(/dashboard/forms/:formId/responses):</b> It helps user to see received responses on their form.</li>
   <li><b>Delete(/dashboard/:formId/deleteForm):</b> It helps user to delete a form using form Id.</li>
 </ul>
 
 <h3>Screenshots</h3>
 <p align="center">
  <img src="/public/images/s1.png" width="700" title="Home Page" alt="Home Page">
  <img src="/public/images/s2.png" width="700" title="Dashboard" alt="Dashboard">
  <img src="/public/images/s3.png" width="700" title="Register" alt="Register">
  <img src="/public/images/s4.png" width="700" title="Manage Form" alt="Manage Form">
  <img src="/public/images/s5.png" width="700" title="Changing Theme" alt="Changing Theme">
  <img src="/public/images/s6.png" width="700" title="Adding MCQ Question" alt="Adding MCQ Question">
  <img src="/public/images/s7.png" width="700" title="Responses Dashboard" alt="Responses Dashboard">
  <img src="/public/images/s8.png" width="700" title="Form" alt="Form">
  <img src="/public/images/s9.png" width="700" title="Form-Off" alt="Form-Off">
 </p>
