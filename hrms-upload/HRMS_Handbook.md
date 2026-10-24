# HRMS Handbook

This handbook explains what HRMS is, who uses it and what it does.

## 1. At a glance

| Item | Details |
| --- | --- |
| What it is | HRMS is an HR platform that holds people records, working time, leave, pay, projects, documents, forms and company knowledge in one place. Each customer company gets its own private workspace. |
| Problem it solves | HR teams usually run a week of work across several disconnected tools, then spend time reconciling them and reconstructing who changed what. HRMS keeps one record per person, lets every other area read from it, and writes down every change as it happens. |
| Who it is for | Small and medium companies that want HR, time, pay and work tracking in one system. It suits any office-based or project-based business. It is not specific to one industry. |
| How to use it | Through a web browser on a computer, tablet or phone. There is also a connection for AI assistants such as Claude and ChatGPT, and a programming interface for building your own integrations. |
| Status | The web portal is live and in use. There is no mobile app. |
| Product | HRMS |

## 2. Business context

**How customers are set up.** Each customer company gets its own private workspace with its own records, its own file storage and its own web address in the form yourcompany.hrms.com. Staff sign in at that address, not at a shared one. A sign-in for one company does not work at another. Setting up a new company is done by the HRMS team and runs through eight steps, shown as a live checklist while it happens.

**Plans.** HRMS is sold per employee per month. There are three plans. Essentials includes every area of the product, a private workspace and the standard roles. Growth adds custom roles with a full permission grid, AI and integration keys, sending email through your own mail server, and bulk approvals with timesheet reminders. Enterprise covers custom arrangements including hosting. Plan features are switched on for your company by the HRMS team. There is no self-service sign-up, card payment or billing screen inside the product.

**Included today:**

- People records, departments, reporting lines and a per-person profile that every other area reads from.
- Weekly timesheets with automatic saving, manager approval, bulk approval, reminders for missing weeks and a monthly summary.
- Leave requests with balances by leave type, company holidays, cancellation requests and manager decisions.
- Monthly payroll that reads working time, company holidays and unpaid leave on its own, with payslips.
- Projects, tasks, sub-tasks, milestones, labels and comments that update live.
- Documents with versions and rollback, plus checklists that collect required documents from employees.
- A form builder with ten question types, conditional logic, templates and a public link anyone can fill in without signing in.
- A knowledge base with categories, tags, a review step before publishing, version history and version comparison.
- Access settings with two ready-made roles and, where enabled, custom roles across eighteen areas.
- An activity trail that records every change with who, when and the values before and after, exportable to a spreadsheet file.
- Notifications in the portal and by email, with per-person preferences.
- An in-portal AI assistant, and a connection that lets AI coding assistants read and update your own work.
- A register for recording your company's AI tools, plans, seats, keys and spend.
- Approval workflows for leave, onboarding and exit, switched on per company.

**Not included today:**

- A mobile app. The portal works in a phone browser, but there is nothing to install from an app store.
- Tax calculation and statutory filing. Payroll produces pay figures and payslips, not tax returns.
- A reports and exports screen. The activity trail can be exported, and timesheets can be exported, but there is no general reporting area.
- One combined approvals inbox. Timesheets, leave and document submissions are each approved on their own screen.
- Self-service password recovery. An administrator resets a password on the employee's behalf.
- Sending a form to a role, a department or a team. A form is either assigned to named people or published as a public link.
- Access to HRMS from a chat or messaging app.
- Ready-made HR and Manager roles. Two roles are supplied, Administrator and Employee, and further roles are built to fit where custom roles are enabled.
- Payroll approval and payment steps on screen. A payroll run can be created and processed in the portal; later stages are handled through approval workflows.

## 3. Users and roles

| Role | Who they are | What they can do | What they cannot do |
| --- | --- | --- | --- |
| HRMS team | The people who run the platform and look after all customer companies. | Create a company and run its setup, suspend and restore a company, change the company administrator, resend a welcome email, switch on custom roles and company mail sending, and see the platform-wide activity trail. | They do not appear in your company's employee list and are not part of your day-to-day work. |
| Administrator | Your company's own owner of the system, usually HR or the business owner. | Everything inside their own company: people, departments, projects and tasks, timesheets, leave and holidays, payroll, documents, forms, knowledge, access settings, the activity trail and company settings. | Nothing inside their own company is withheld. They cannot see or affect any other company, and cannot create or suspend companies. |
| Employee | Any member of staff with a portal account. | Their own timesheets, tasks, leave, assigned forms and required documents, plus shared projects, documents and the knowledge base. | They cannot see other people's records, approve anything, run payroll, open access settings or open the activity trail, unless an administrator grants it. |
| Custom role | A role your administrator builds for a particular job, for example a team leader who approves timesheets. | Exactly the areas and actions the administrator ticks, limited to the records the chosen reach allows. | Anything not ticked. Custom roles are available where the HRMS team has enabled them for your company. |

Roles work on two levels inside a company. Every person has an account type, either Administrator or Employee, which decides the shape of their menu. On top of that, an administrator can assign a role that grants named permissions. A permission is an area plus an action, for example Employees plus Edit. Each permission also has a reach, which decides how much it covers: own records, their team, their department, their projects, or the whole company. An Administrator always has full access to their own company, so a role is only needed for people who are not administrators.

| Area | View | Create | Update | Delete |
| --- | --- | --- | --- | --- |
| Employees | Yes | Yes | Yes | Yes |
| Departments | Yes | Yes | Yes | Yes |
| Projects | Yes | Yes | Yes | Yes |
| Tasks | Yes | Yes | Yes | Yes |
| Timesheets | Yes | Yes | Yes | Yes |
| Leave | Yes | Yes | Yes | Yes |
| Payroll | Yes | Yes | Yes | Yes |
| Documents | Yes | Yes | Yes | Yes |
| Document requirements | Yes | Yes | Yes | Yes |
| Forms | Yes | Yes | Yes | Yes |
| Knowledge | Yes | Yes | Yes | Yes |
| Notifications | Yes | Yes | Yes | Yes |
| Roles | Yes | Yes | Yes | Yes |
| Settings | Yes | Yes | Yes | Yes |
| Activity trail | Yes | Yes | Yes | Yes |
| AI register | Yes | Yes | Yes | Yes |
| AI credentials | Yes | Yes | Yes | Yes |
| AI work sessions | Yes | Yes | Yes | Yes |

Some areas carry extra actions beyond the four above, so that sensitive steps can be held separately from ordinary editing. These are approve, reject, submit, review, lock, assign, export and manage. For example, approving a timesheet is its own permission and is not included in the permission to edit one.

## 4. Features

| Area | Feature | What it does | Available on |
| --- | --- | --- | --- |
| Sign in and account | Company sign-in | Signs a person in at their own company address, using single sign-on. There is no password to type into HRMS itself. | Web |
| Sign in and account | Invitation link | Opens a one-time link from an invitation or reset email and finishes setting up the account. | Web |
| Sign in and account | My Profile | Shows a person's own details and lets them change their password. | Web |
| Sign in and account | Theme switch | Switches the portal between light and dark appearance. | Web |
| People and organisation | Employees | Lists everyone, with search, filters by status and department, and an action menu per person. | Web, API, AI connection |
| People and organisation | Add Employee | Captures personal details, job details, organisation and optional pay information, and creates a portal account. | Web, API |
| People and organisation | Employee record | One page per person with tabs for overview, leave, timesheets, documents, forms and permissions. | Web, API |
| People and organisation | Send portal invite | Emails an employee a link so they can sign in for the first time. | Web, API |
| People and organisation | Reset password | Sends an employee a new sign-in link and signs them out of all devices. | Web, API |
| People and organisation | Suspend and reactivate | Stops an employee signing in without deleting their record, and restores access later. | Web, API |
| People and organisation | Departments | Creates departments, names a department head and assigns members. | Web, API, AI connection |
| Work | Projects | Creates projects with a code, status, priority, team and activity log. | Web, API, AI connection |
| Work | Tasks | Creates tasks and sub-tasks with assignees, priority, due dates, labels and milestones. | Web, API, AI connection |
| Work | Task comments | Discussion on a task that updates live for everyone viewing it. | Web, API |
| Work | My Tasks | An employee's own task list, separate from the company-wide view. | Web, API, AI connection |
| Work | Labels | Shared tags used across work items. | Web, API |
| Timesheets | My Timesheets | A weekly grid that saves as you type, with a monthly summary of hours. | Web, API, AI connection |
| Timesheets | Submit for approval | Sends a completed week to a manager, with checks before it can be sent. | Web, API, AI connection |
| Timesheets | Timesheets console | Lets a manager review, approve or reject weeks, including several at once. | Web, API |
| Timesheets | Missing submissions | Lists who has not submitted and sends them a reminder. | Web |
| Timesheets | Weekly reminder | Sends an automatic reminder every Monday morning. | Web |
| Timesheets | Export | Downloads timesheet data as a spreadsheet file. | Web |
| Leave and holidays | Apply for leave | Requests leave by type and dates, showing the working days it will actually cost. | Web, API, AI connection |
| Leave and holidays | Leave balances | Shows days used and days remaining for each leave type in the current year. | Web, API, AI connection |
| Leave and holidays | Approve or reject leave | Lets a manager decide a request and see the person's balance while deciding. | Web, API |
| Leave and holidays | Withdraw or cancel | Lets an employee withdraw a pending request or ask to cancel an approved one, for a manager to confirm. | Web, API |
| Leave and holidays | Leave types | Creates leave types with a yearly allowance and whether they are paid. | Web, API |
| Leave and holidays | Company holidays | Adds holidays one at a time, as a range, or by importing a list, with optional yearly repeat. | Web, API |
| Payroll | Run payroll | Produces a monthly run that is already adjusted for join dates, company holidays and unpaid leave. | Web, API |
| Payroll | Payslips | Opens a per-person breakdown of a run and prints it. | Web, API |
| Payroll | Compensation | Records salary and payment period for a person, visible only to those allowed to see pay. | Web, API |
| Documents | Documents | Uploads, previews, downloads and organises files by category and visibility. | Web, API |
| Documents | Versions and rollback | Keeps every version of a file and restores an earlier one. | Web, API |
| Documents | Document requirements | Builds a checklist of documents to collect, assigns it, and tracks completion. | Web, API |
| Documents | Submit and review | Lets an employee upload what was asked for, and a reviewer approve or reject it with a comment. | Web, API |
| Forms | Form builder | Builds a form by dragging question types onto a canvas, with help text and required questions. | Web, API |
| Forms | Conditional logic | Shows, hides or skips to a section based on an earlier answer. | Web, API |
| Forms | Form templates | Starts a new form from a ready-made onboarding or feedback template. | Web |
| Forms | Public form link | Publishes a form so anyone with the link can fill it in without signing in. | Web |
| Forms | My Forms | Lists the forms assigned to a person and collects their answers. | Web, API |
| Forms | Responses | Reads submitted answers as a list and one response at a time. | Web, API |
| Knowledge | Knowledge Base | Holds policies and how-to articles, organised by category and tag, with search. | Web, API, AI connection |
| Knowledge | Review before publishing | Holds a contributor's article in a queue until an approver publishes it. | Web, API |
| Knowledge | Versions and compare | Keeps article history and shows the difference between two versions side by side. | Web |
| Approvals | Workflows | Switches approval workflows on per company for leave, onboarding and exit. | Web |
| Approvals | Workflow studio | Builds and publishes the approval steps a workflow follows. | Web |
| Approvals | My approvals | Opens the inbox of workflow decisions waiting for a person. | Web |
| Approvals | Override | Lets an administrator decide by hand while a workflow is running, with a reason recorded. | Web |
| Activity and notifications | Activity Trail | Lists every recorded change with who made it, when, and the values before and after, with filters. | Web, API |
| Activity and notifications | Export activity | Downloads the filtered activity trail as a spreadsheet file. | Web |
| Activity and notifications | Notifications | Shows recent updates in the portal and sends email, with per-person preferences. | Web, API |
| Account and settings | Settings | Holds the company profile, timesheet rules and email delivery settings. | Web, API |
| Account and settings | Roles and Permissions | Builds custom roles by ticking areas, actions and reach, where enabled for the company. | Web, API |
| AI and integrations | AI Assistant | Answers questions and carries out tasks inside the portal, within the person's own permissions. | Web |
| AI and integrations | Connect apps | Connects Claude or ChatGPT so staff can use HRMS from those apps. | Web |
| AI and integrations | Access keys | Creates personal keys for other AI tools, with a chosen level of access and an expiry date. | Web, API |
| AI and integrations | Work sessions | Lists AI coding sessions that are not yet attached to a task, so a person can attach or dismiss them. | Web, API |
| AI and integrations | AI Register | Records your company's AI vendors, plans, seats, keys, usage and spend. | Web, API |
| AI and integrations | AI model | Connects your own AI provider for the in-portal assistant. | Web |
| HRMS team console | Companies | Creates, views, suspends, restores and removes customer companies. | Web, API |
| HRMS team console | Workspace setup | Shows the eight setup steps live and allows a restart if one needs attention. | Web |
| HRMS team console | Feature permissions | Switches custom roles and company mail sending on for a company. | Web |

## 5. Key user journeys

**Setting up a new company (HRMS team)**

1. Sign in at the platform address and open Companies.
2. Choose Add Company and fill in Company Information, including the company name and the workspace address.
3. Enter the first administrator's name and email address.
4. Choose Create Company and watch the setup checklist run through its eight steps, ending at Workspace ready.
5. If a step needs attention, open the company and choose Re-run setup.
6. The new administrator receives a welcome email and opens the link to sign in for the first time.

**Adding an employee and giving them access (Administrator)**

1. Open Employees and choose Add Employee.
2. Complete Personal Information, Job Details and Organization. Payment Information is optional and can be added later.
3. Save the record. The employee code is created for you and can be changed.
4. On the employee's row, open Actions and choose Send portal invite.
5. Open the employee record, go to the Permissions tab, and assign a role under Access and Permissions.
6. The employee opens the invitation email and signs in. They see their own Workspace menu, plus a Granted Access group for anything extra you gave them.

**Filling in and approving a week of time (Employee, then Manager)**

1. The employee opens Timesheets and chooses New Timesheet, then picks a date in the week they want.
2. They enter hours against a project and task. Entries save as they type, and the header shows when it last saved.
3. They choose Submit for Approval and confirm. The week moves from Draft to Submitted.
4. The manager opens Timesheets, finds the week and chooses the approve or reject action on the row.
5. To handle several at once, the manager selects rows and uses the approve or reject button on the selection bar.
6. If rejected, the employee edits the week and chooses Resubmit for Approval.

**Requesting and approving leave (Employee, then Manager)**

1. The employee opens Leave and uses Apply for Leave.
2. They pick a leave type, a start date and an end date. The summary shows the working days it will cost, how many weekends and holidays were not counted, and what their balance will be afterwards.
3. They choose Submit Request. It appears under My Requests as Pending.
4. The manager opens Leave, goes to All Requests, and approves or rejects the request. The employee's balance is shown while deciding.
5. If the employee changes their mind, they choose Withdraw while it is pending, or Ask to cancel once it is approved, and the manager confirms.

**Collecting required documents (Administrator, then Employee)**

1. The administrator opens Documents, goes to Requirements and chooses New Requirement.
2. They give the checklist a title, add an item for each document, and mark which items are required.
3. They choose who it applies to: all employees, specific departments or specific people.
4. The employee opens Documents, goes to My Requirements and chooses Upload on each item.
5. The administrator opens the requirement, opens a submission, adds a review comment and chooses Approve or Reject.
6. The uploaded file also appears under All Documents, where it keeps its version history.

**Connecting an AI assistant to your own work (Employee)**

1. Open Settings, then AI Settings, then the Connect apps tab.
2. For Claude or ChatGPT, choose Connect and follow the steps for the app you use. You will be asked to allow the connection, and you can disconnect later from the same place.
3. For any other tool, choose Get a key, pick how much access it should have and an expiry date, then choose Generate Key. The key is shown once, so copy it then.
4. Ask the assistant a question such as who am I in HRMS, or to show your open tasks, to confirm it is connected.
5. To record coding work automatically, follow Record your work automatically on the AI help page.
6. Review what was recorded under the Work sessions tab, attaching a session to a task or marking it as not task work.

## 6. Business rules

**Uploads**

| Rule | Value |
| --- | --- |
| Largest file that can be uploaded | 10 MB |
| File types accepted | PDF, Word, Excel, PNG and JPEG |
| Message when a file is too large | "File exceeds the 10 MB limit" |
| Image checks | An image whose type does not match its file extension is refused. |
| File names | Only the file name is kept. Any folder path in the name is removed. |
| Versions | Every upload of a new version is kept, and an earlier version can be restored. |

**Working time**

| Rule | Value |
| --- | --- |
| Timesheet week | Monday to Sunday, one timesheet per person per week |
| Hours per entry | Between 0.25 and 24 |
| Hours per day | 24 at most |
| Message when a day is over the limit | "A day cannot have more than 24 hours. Too many hours on: Mon 05 May." |
| Message when submitting an empty week | "Log at least one hour to submit." |
| Message when a row is incomplete | "Every task row on a day with hours needs a task and a description. Missing on: Mon 05 May." |
| Message when a task is entered twice in a day | "The same task is entered twice on one day - remove one of the rows. On: Mon 05 May." |
| How far ahead hours can be logged | Up to the end of the current week |
| Hours before a person joined | Cannot be logged |
| Automatic locking | A week that is still unapproved 14 days after it ends is locked and can no longer be changed. |
| Weekly reminder | Sent every Monday at 09:00 to anyone who has not submitted. |

**Leave and holidays**

| Rule | Value |
| --- | --- |
| Working days | Monday to Friday. Saturday and Sunday are never counted as leave. |
| Company holidays | Not counted as leave, and can be set to repeat every year. |
| Default yearly allowances | Annual 12 days, Sick 8 days, Casual 6 days, Emergency 3 days, Unpaid 0 days |
| Longest single request | 366 days |
| Balance shown | Yearly allowance less days already approved. Days awaiting a decision are shown separately. |
| Overlapping requests | A new request that overlaps a pending or approved one is refused. |
| Request with no working days | Refused, with the message "Selected range contains no working days" |
| Cancelling approved leave | The employee asks to cancel and a manager confirms or declines. |

**Statuses**

| Rule | Value |
| --- | --- |
| Employee | Active, Inactive, Suspended, On leave, Terminated, Probation |
| Timesheet | Draft, Submitted, Under review, Approved, Rejected, Locked |
| Leave request | Pending, Approved, Rejected, Cancellation requested, Cancelled |
| Task | To do, In progress, In review, Done, Cancelled, Blocked |
| Project | Planning, Active, On hold, Completed, Archived, Cancelled |
| Form | Draft, Published, Archived |
| Knowledge article | Draft, In review, Published, Archived, Rejected |
| Document submission | Submitted, Approved, Rejected |
| Company | Active, Suspended, Trash, Deleted |

**Reference codes**

| Rule | Value |
| --- | --- |
| Employee code | First name followed by the join date, for example JOHN15012025. It can be edited and must be unique in your company. |
| Project code | Taken from the project name, for example ACME. Created for you if the one you choose is taken. |
| Task code | The project code followed by a four digit number, for example ACME-0042. A task with no project uses TASK followed by a number. |
| Workspace address | Your company name in lower case with spaces replaced by hyphens, for example acme-labs. |

**Accounts and security**

| Rule | Value |
| --- | --- |
| Signing in | Through single sign-on at your own company address. HRMS stores no passwords. |
| Invitation link | Valid for 24 hours and can be opened once. |
| Password reset link | Valid for 1 hour and can be opened once. |
| Message when a link has expired | "Invitation links can only be opened once and expire after 24 hours. If yours has already been used, ask your administrator to send a new one." |
| Forgotten password | An administrator sends a new sign-in link. The person is signed out of all devices. |
| Sign-in attempts | Limited to 5 per minute. |
| General service limit | 60 requests per minute. |
| Suspended company | Every request is refused and staff see "Company is suspended. Please contact platform administrator" |
| Closed company | Moved to Trash and can be restored. After the retention period it is permanently removed, including its records and files. |
| Personal access keys | Up to 5 at a time per person, each lasting at most 90 days. |
| AI connection limit | 60 requests per minute for each key. |
| AI assistant limit | 20 messages per minute per person, with a single message limited to 8,000 characters. |
| AI work sessions | A session with no activity for 30 minutes is closed automatically and dated from its last activity. |

## 7. Glossary

| Term | Meaning |
| --- | --- |
| Access key | A personal key that lets an outside tool, usually an AI assistant, work in HRMS on your behalf. |
| Action | What someone may do in an area, for example view, create, edit, delete or approve. |
| Activity trail | The record of every change made in your company, showing who made it, when, and the values before and after. |
| Administrator | The role that has full access to everything inside one company. |
| AI assistant | The helper built into the portal that answers questions and carries out tasks within your own permissions. |
| AI connection | The link that lets an AI app such as Claude or ChatGPT read and update your work in HRMS. |
| AI register | The area where a company records the AI tools it pays for, including plans, seats, keys and spend. |
| API | A programming interface that lets another system read and update HRMS data directly. |
| Area | A part of the product that permissions are granted against, for example Employees or Timesheets. |
| Company | One customer organisation on the platform, with its own private workspace. |
| Company holiday | A day the whole company does not work. It is not counted against anyone's leave. |
| Department | A group of employees within a company, which can have a head. |
| Document requirement | A checklist of documents a company asks employees to supply. |
| Employee code | The short reference that identifies a person within a company. |
| HRMS team | The people who run the platform and look after all customer companies. |
| Knowledge base | The library of company policies and how-to articles. |
| Label | A shared tag used to group work items. |
| Leave type | A named kind of leave with its own yearly allowance, for example Annual or Sick. |
| Milestone | A dated checkpoint within a project. |
| Payroll run | One month's pay calculation for a company, which produces payslips. |
| Payslip | One person's pay breakdown for one payroll run. |
| Permission | An area plus an action, for example Employees plus Edit. |
| Reach | How much a permission covers: own records, their team, their department, their projects, or the whole company. |
| Role | A named set of permissions that can be assigned to a person. |
| Single sign-on | Signing in through one trusted service rather than entering a password into HRMS. |
| Sub-task | A smaller piece of work listed under a task. |
| Timesheet | One person's hours for one week, from Monday to Sunday. |
| Trash | The state a company is moved to when it is closed. It can be restored until the retention period ends. |
| Work session | A record that an AI coding assistant was working, and on which task if that can be established. |
| Workflow | An approval process with defined steps, used for leave, onboarding and exit. |
| Workspace | A company's own private area of HRMS, holding its records and files. |
| Workspace address | The web address a company's staff sign in at, in the form yourcompany.hrms.com. |
