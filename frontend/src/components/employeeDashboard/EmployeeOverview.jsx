import React from "react";
import PageLayout from "../layout/PageLayout";
import { observer } from "mobx-react-lite";
import Card from "../common/Card";
import { User } from "lucide-react";
import { authStore } from "../../stores/auth.store";

const EmployeeOverview = observer(() => {
  const { user } = authStore;

  return (
    <PageLayout title={"Employee Dashboard"}>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card
          name="Welcome Back"
          icon={User}
          value={user.name}
          color="oklch(71.5% 0.143 215.221)"
        />
      </div>
    </PageLayout>
  );
});

export default EmployeeOverview;
