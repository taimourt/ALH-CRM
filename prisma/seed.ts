const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const DEFAULT_ROLE_PRESETS = {
  SUPER_ADMIN: [
    'leads.view', 'leads.create', 'leads.edit', 'leads.delete', 'leads.assign', 'leads.export',
    'properties.view', 'properties.create', 'properties.edit', 'properties.delete', 'properties.export',
    'deals.view', 'deals.create', 'deals.edit', 'deals.delete',
    'payments.view', 'payments.create', 'payments.edit', 'payments.delete',
    'commissions.view', 'commissions.create', 'commissions.edit',
    'users.view', 'users.create', 'users.edit', 'users.delete',
    'reports.view', 'reports.export', 'settings.manage', 'ai.use'
  ],
  ADMIN: [
    'leads.view', 'leads.create', 'leads.edit', 'leads.delete', 'leads.assign', 'leads.export',
    'properties.view', 'properties.create', 'properties.edit', 'properties.delete', 'properties.export',
    'deals.view', 'deals.create', 'deals.edit', 'deals.delete',
    'payments.view', 'payments.create', 'payments.edit', 'payments.delete',
    'commissions.view', 'commissions.create', 'commissions.edit',
    'users.view', 'users.create', 'users.edit', 'users.delete',
    'reports.view', 'reports.export', 'ai.use'
  ],
  MANAGER: [
    'leads.view', 'leads.create', 'leads.edit', 'leads.assign', 'leads.export',
    'properties.view', 'properties.create', 'properties.edit',
    'deals.view', 'deals.create', 'deals.edit',
    'payments.view', 'commissions.view', 'reports.view', 'reports.export', 'ai.use'
  ],
  SALES_AGENT: [
    'leads.view', 'leads.create', 'leads.edit', 'properties.view', 'deals.view', 'deals.create', 'ai.use'
  ],
  ACCOUNTS: [
    'payments.view', 'payments.create', 'payments.edit', 'commissions.view', 'commissions.create', 'reports.view'
  ],
};

async function main() {
  console.log('Seeding Asad Land Holdings Enterprise User & Security Database...');

  // Clean tables
  await prisma.auditLog.deleteMany();
  await prisma.emailQueue.deleteMany();
  await prisma.emailTemplate.deleteMany();
  await prisma.userSession.deleteMany();
  await prisma.notificationPreference.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.communication.deleteMany();
  await prisma.commission.deleteMany();
  await prisma.installment.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.siteVisit.deleteMany();
  await prisma.deal.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.property.deleteMany();
  await prisma.society.deleteMany();
  await prisma.team.deleteMany();
  await prisma.department.deleteMany();
  await prisma.role.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create System Roles
  const roleSuperAdmin = await prisma.role.create({
    data: {
      name: 'Super Admin',
      description: 'Unrestricted system access to all CRM data, financial ledgers, and security settings.',
      permissions: JSON.stringify(DEFAULT_ROLE_PRESETS.SUPER_ADMIN),
      isSystem: true,
    },
  });

  const roleAdmin = await prisma.role.create({
    data: {
      name: 'Admin',
      description: 'Full operational access to CRM records and user administration.',
      permissions: JSON.stringify(DEFAULT_ROLE_PRESETS.ADMIN),
      isSystem: true,
    },
  });

  const roleManager = await prisma.role.create({
    data: {
      name: 'Manager',
      description: 'Supervises sales team leads, approves deals, and views team analytics.',
      permissions: JSON.stringify(DEFAULT_ROLE_PRESETS.MANAGER),
      isSystem: true,
    },
  });

  const roleSalesAgent = await prisma.role.create({
    data: {
      name: 'Sales Agent',
      description: 'Manages assigned leads, site visits, and property deal pipeline.',
      permissions: JSON.stringify(DEFAULT_ROLE_PRESETS.SALES_AGENT),
      isSystem: true,
    },
  });

  const roleAccounts = await prisma.role.create({
    data: {
      name: 'Accounts',
      description: 'Manages customer payments, installment ledgers, and commission disbursements.',
      permissions: JSON.stringify(DEFAULT_ROLE_PRESETS.ACCOUNTS),
      isSystem: true,
    },
  });

  console.log('Created System Roles');

  // 2. Create Departments & Teams
  const deptSales = await prisma.department.create({
    data: {
      name: 'Sales Department',
      description: 'Property sales advisors and client relationship managers.',
    },
  });

  const deptMarketing = await prisma.department.create({
    data: {
      name: 'Marketing Department',
      description: 'Lead generation, social media campaigns, and brand marketing.',
    },
  });

  const deptAccounts = await prisma.department.create({
    data: {
      name: 'Accounts & Finance',
      description: 'Payment receipts, installment tracking, and financial ledgers.',
    },
  });

  const teamAlpha = await prisma.team.create({
    data: {
      name: 'Sales Team Alpha (Islamabad Corridor)',
      departmentId: deptSales.id,
    },
  });

  const teamBeta = await prisma.team.create({
    data: {
      name: 'Sales Team Beta (Rawalpindi / Taxila)',
      departmentId: deptSales.id,
    },
  });

  console.log('Created Departments & Teams');

  // 3. Create Users (Super Admin and Saif Ur Rehman)
  const userSuperAdmin = await prisma.user.create({
    data: {
      firstName: 'Asad',
      lastName: 'Khan',
      name: 'Asad Khan',
      email: 'asad@asadlandholdings.com',
      password: 'hashed_password_123',
      role: 'SUPER_ADMIN',
      roleId: roleSuperAdmin.id,
      departmentId: deptSales.id,
      teamId: teamAlpha.id,
      employeeId: 'EMP-001',
      status: 'ACTIVE',
      jobTitle: 'Chief Executive Officer',
      phone: '03008554433',
      whatsappNumber: '03008554433',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      lastLoginAt: new Date(),
    },
  });

  const userSaif = await prisma.user.create({
    data: {
      firstName: 'Saif Ur',
      lastName: 'Rehman',
      name: 'Saif Ur Rehman',
      email: 'saif.rehman.buic@gmail.com',
      password: 'hashed_password_123',
      role: 'SALES_AGENT',
      roleId: roleSalesAgent.id,
      departmentId: deptSales.id,
      teamId: teamAlpha.id,
      managerId: userSuperAdmin.id,
      employeeId: 'EMP-002',
      status: 'ACTIVE',
      jobTitle: 'Sales Agent',
      phone: '03001234567',
      whatsappNumber: '03001234567',
      lastLoginAt: new Date(),
    },
  });

  console.log('Created Users: Super Admin (Asad Khan) and Sales Agent (Saif Ur Rehman)');

  // 4. Create Email Templates
  await prisma.emailTemplate.createMany({
    data: [
      {
        slug: 'user-invitation',
        name: 'User Invitation Email',
        subject: 'Invitation to Join {{company_name}} Real Estate Operating System',
        bodyHtml: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Assalam-o-Alaikum {{first_name}},</h2>
            <p>You have been invited by <strong>{{company_name}}</strong> to join the real estate CRM system as a <strong>{{role_name}}</strong>.</p>
            <p>Please click the button below to create your password and set up your profile:</p>
            <p style="margin: 25px 0;">
              <a href="{{invitation_link}}" style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Set Your Password</a>
            </p>
            <p style="font-size: 12px; color: #6b7280;">Note: This invitation link is single-use and will expire automatically.</p>
          </div>
        `,
        variables: JSON.stringify(['first_name', 'company_name', 'role_name', 'invitation_link']),
        enabled: true,
      },
      {
        slug: 'site-visit-reminder',
        name: 'Site Visit Reminder Email',
        subject: 'Site Inspection Scheduled for {{property_name}} - {{site_visit_date}}',
        bodyHtml: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Assalam-o-Alaikum {{first_name}},</h2>
            <p>This is a reminder for your upcoming site visit for <strong>{{property_name}}</strong> in <strong>{{society}}</strong>.</p>
            <p><strong>Date & Time:</strong> {{site_visit_date}} at {{site_visit_time}}</p>
            <p><strong>Assigned Advisor:</strong> {{agent_name}}</p>
            <p>Thank you for choosing {{company_name}}.</p>
          </div>
        `,
        variables: JSON.stringify(['first_name', 'property_name', 'society', 'site_visit_date', 'site_visit_time', 'agent_name', 'company_name']),
        enabled: true,
      },
    ],
  });

  console.log('Created Email Templates');

  // 5. Create Administrative Audit Logs
  await prisma.auditLog.createMany({
    data: [
      {
        actorId: userSuperAdmin.id,
        action: 'USER_CREATED',
        targetType: 'USER',
        targetId: userSaif.id,
      },
      {
        actorId: userSuperAdmin.id,
        action: 'ROLE_PERMISSIONS_UPDATED',
        targetType: 'ROLE',
        targetId: roleSalesAgent.id,
      },
    ],
  });

  console.log('Enterprise User Management & Security database seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
