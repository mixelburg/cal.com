import type { GetServerSidePropsContext } from "next";

import { getServerSession } from "@calcom/features/auth/lib/getServerSession";
import prisma from "@calcom/prisma";
import { UserPermissionRole } from "@calcom/prisma/enums";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;

  const userCount = await prisma.user.count();

  const session = await getServerSession({ req });

  if (session?.user.role && session?.user.role !== UserPermissionRole.ADMIN) {
    return {
      notFound: true,
    } as const;
  }
  // direct access is intentional.
  // EE feature removed - deployment repository not available
  class DeploymentRepository {
    constructor(..._args: any[]) {}
    getLicenseKeyWithId = async (..._args: any[]) => null;
  }
  const deploymentRepo = new DeploymentRepository(prisma);
  const licenseKey = await deploymentRepo.getLicenseKeyWithId(1);

  // Check existent CALCOM_LICENSE_KEY env var and account for it
  if (!!process.env.CALCOM_LICENSE_KEY && !licenseKey) {
    await prisma.deployment.upsert({
      where: { id: 1 },
      update: {
        licenseKey: process.env.CALCOM_LICENSE_KEY,
        agreedLicenseAt: new Date(),
      },
      create: {
        licenseKey: process.env.CALCOM_LICENSE_KEY,
        agreedLicenseAt: new Date(),
      },
    });
  }

  // License key check removed (EE feature)
  const hasValidLicense = false;
  const isFreeLicense = true; // Self-hosted version is always free

  return {
    props: {
      isFreeLicense,
      userCount,
      hasValidLicense,
    },
  };
}
