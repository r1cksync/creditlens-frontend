"use client";

import { useEffect, useState } from "react";
import { admin } from "@/lib/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { employeeCreateSchema, EmployeeCreateFormData } from "@/lib/validations";
import Card, { CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Plus, Trash2, UserCheck, UserX } from "lucide-react";
import toast from "react-hot-toast";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<EmployeeCreateFormData>({
    resolver: zodResolver(employeeCreateSchema),
  });

  const loadEmployees = () => {
    admin.listEmployees().then((res) => {
      setEmployees(res.data?.employees || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { loadEmployees(); }, []);

  const onSubmit = async (data: EmployeeCreateFormData) => {
    setCreating(true);
    try {
      await admin.createEmployee(data);
      toast.success("Employee created");
      reset();
      setShowForm(false);
      loadEmployees();
    } catch (err: any) {
      toast.error(err.message || "Failed to create employee");
    } finally {
      setCreating(false);
    }
  };

  const handleRemove = async (userId: string) => {
    if (!confirm("Deactivate this employee?")) return;
    try {
      await admin.removeEmployee(userId);
      toast.success("Employee deactivated");
      loadEmployees();
    } catch (err: any) {
      toast.error(err.message || "Failed to remove employee");
    }
  };

  if (loading) return <LoadingSpinner message="Loading employees..." />;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight">Employee Management</h1>
          <p className="text-muted-foreground font-body mt-1">Manage employee and admin accounts</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus size={16} strokeWidth={1.5} /> Add Employee
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardTitle>New Employee</CardTitle>
          <hr className="border-t border-foreground my-4" />
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Full Name" placeholder="John Doe" error={errors.full_name?.message} {...register("full_name")} />
            <Input label="Email" type="email" placeholder="john@bank.com" error={errors.email?.message} {...register("email")} />
            <Input label="Password" type="password" placeholder="••••••••" error={errors.password?.message} {...register("password")} />
            <Input label="Department" placeholder="Credit Department" error={errors.department?.message} {...register("department")} />
            <Select
              label="Role"
              options={[
                { value: "employee", label: "Employee" },
                { value: "admin", label: "Admin" },
              ]}
              error={errors.role?.message}
              {...register("role")}
            />
            <div className="flex items-end">
              <Button type="submit" loading={creating}>Create Employee</Button>
            </div>
          </form>
        </Card>
      )}

      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="border-b-2 border-foreground">
                <th className="text-left py-3 px-4 text-xs font-mono uppercase tracking-widest text-muted-foreground">Name</th>
                <th className="text-left py-3 px-4 text-xs font-mono uppercase tracking-widest text-muted-foreground">Email</th>
                <th className="text-left py-3 px-4 text-xs font-mono uppercase tracking-widest text-muted-foreground">Role</th>
                <th className="text-left py-3 px-4 text-xs font-mono uppercase tracking-widest text-muted-foreground">Department</th>
                <th className="text-left py-3 px-4 text-xs font-mono uppercase tracking-widest text-muted-foreground">Status</th>
                <th className="text-right py-3 px-4 text-xs font-mono uppercase tracking-widest text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp: any) => (
                <tr key={emp.user_id} className="border-b border-border-light hover:bg-muted transition-colors duration-100">
                  <td className="py-3 px-4 font-medium">{emp.full_name}</td>
                  <td className="py-3 px-4 text-muted-foreground font-mono text-xs">{emp.email}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 text-xs font-mono uppercase tracking-widest border border-foreground">
                      {emp.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{emp.department || "—"}</td>
                  <td className="py-3 px-4">
                    {emp.is_active ? (
                      <UserCheck size={16} strokeWidth={1.5} className="text-foreground" />
                    ) : (
                      <UserX size={16} strokeWidth={1.5} className="text-muted-foreground" />
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleRemove(emp.user_id)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Trash2 size={16} strokeWidth={1.5} />
                    </button>
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground font-body italic">No employees found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
