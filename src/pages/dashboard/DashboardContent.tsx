import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface SiteContent {
  id: string;
  section: string;
  data: any;
  created_at: string;
  updated_at: string;
}

const DashboardContent = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [contents, setContents] = useState<SiteContent[]>([]);
  const [editingSection, setEditingSection] = useState<string | null>(null);

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    setLoading(true);
    try {
      console.log("Fetching site content...");
      const { data, error } = await supabase
        .from("site_content")
        .select("*")
        .order("section");

      console.log("Fetch result:", { data, error });

      if (error) {
        console.error("Fetch error:", error);
        toast({ 
          title: "خطأ في تحميل البيانات", 
          description: error.message, 
          variant: "destructive" 
        });
        setContents([]);
      } else {
        console.log("Data loaded successfully:", data);
        setContents(data || []);
      }
    } catch (err: any) {
      console.error("Unexpected error:", err);
      toast({ 
        title: "خطأ", 
        description: "حدث خطأ غير متوقع", 
        variant: "destructive" 
      });
      setContents([]);
    } finally {
      setLoading(false);
    }
  };

  const updateContent = async (section: string, newData: any) => {
    const { error } = await supabase
      .from("site_content")
      .update({ data: newData })
      .eq("section", section);

    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "تم الحفظ بنجاح" });
      fetchContents();
      setEditingSection(null);
    }
  };

  const getContent = (section: string) => {
    return contents.find((c) => c.section === section);
  };

  const renderCompanyInfo = () => {
    const content = getContent("company_info");
    if (!content) return null;

    const data = content.data;
    const isEditing = editingSection === "company_info";

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>معلومات الشركة</CardTitle>
            <Button
              size="sm"
              onClick={() => {
                if (isEditing) {
                  setEditingSection(null);
                } else {
                  setEditingSection("company_info");
                }
              }}
            >
              {isEditing ? "إلغاء" : "تعديل"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>الاسم (عربي)</Label>
                  <Input
                    value={data.name}
                    onChange={(e) =>
                      setContents(
                        contents.map((c) =>
                          c.section === "company_info"
                            ? { ...c, data: { ...c.data, name: e.target.value } }
                            : c
                        )
                      )
                    }
                  />
                </div>
                <div>
                  <Label>الاسم (English)</Label>
                  <Input
                    value={data.nameEn}
                    onChange={(e) =>
                      setContents(
                        contents.map((c) =>
                          c.section === "company_info"
                            ? { ...c, data: { ...c.data, nameEn: e.target.value } }
                            : c
                        )
                      )
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>الاسم الكامل (عربي)</Label>
                  <Input
                    value={data.fullName}
                    onChange={(e) =>
                      setContents(
                        contents.map((c) =>
                          c.section === "company_info"
                            ? { ...c, data: { ...c.data, fullName: e.target.value } }
                            : c
                        )
                      )
                    }
                  />
                </div>
                <div>
                  <Label>الاسم الكامل (English)</Label>
                  <Input
                    value={data.fullNameEn}
                    onChange={(e) =>
                      setContents(
                        contents.map((c) =>
                          c.section === "company_info"
                            ? { ...c, data: { ...c.data, fullNameEn: e.target.value } }
                            : c
                        )
                      )
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>الهاتف</Label>
                  <Input
                    value={data.phone}
                    onChange={(e) =>
                      setContents(
                        contents.map((c) =>
                          c.section === "company_info"
                            ? { ...c, data: { ...c.data, phone: e.target.value } }
                            : c
                        )
                      )
                    }
                  />
                </div>
                <div>
                  <Label>واتساب</Label>
                  <Input
                    value={data.whatsapp}
                    onChange={(e) =>
                      setContents(
                        contents.map((c) =>
                          c.section === "company_info"
                            ? { ...c, data: { ...c.data, whatsapp: e.target.value } }
                            : c
                        )
                      )
                    }
                  />
                </div>
                <div>
                  <Label>البريد الإلكتروني</Label>
                  <Input
                    value={data.email}
                    onChange={(e) =>
                      setContents(
                        contents.map((c) =>
                          c.section === "company_info"
                            ? { ...c, data: { ...c.data, email: e.target.value } }
                            : c
                        )
                      )
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>العنوان (عربي)</Label>
                  <Input
                    value={data.address}
                    onChange={(e) =>
                      setContents(
                        contents.map((c) =>
                          c.section === "company_info"
                            ? { ...c, data: { ...c.data, address: e.target.value } }
                            : c
                        )
                      )
                    }
                  />
                </div>
                <div>
                  <Label>العنوان (English)</Label>
                  <Input
                    value={data.addressEn}
                    onChange={(e) =>
                      setContents(
                        contents.map((c) =>
                          c.section === "company_info"
                            ? { ...c, data: { ...c.data, addressEn: e.target.value } }
                            : c
                        )
                      )
                    }
                  />
                </div>
              </div>

              <Button onClick={() => updateContent("company_info", data)}>
                حفظ التغييرات
              </Button>
            </>
          ) : (
            <div className="space-y-2 text-sm">
              <p><strong>الاسم:</strong> {data.name} / {data.nameEn}</p>
              <p><strong>الاسم الكامل:</strong> {data.fullName}</p>
              <p><strong>الهاتف:</strong> {data.phone}</p>
              <p><strong>واتساب:</strong> {data.whatsapp}</p>
              <p><strong>البريد:</strong> {data.email}</p>
              <p><strong>العنوان:</strong> {data.address}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderStats = () => {
    const content = getContent("stats");
    if (!content) return null;

    const data = content.data;
    const isEditing = editingSection === "stats";

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>الإحصائيات</CardTitle>
            <Button
              size="sm"
              onClick={() => {
                if (isEditing) {
                  setEditingSection(null);
                } else {
                  setEditingSection("stats");
                }
              }}
            >
              {isEditing ? "إلغاء" : "تعديل"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <>
              {data.items.map((stat: any, index: number) => (
                <div key={index} className="grid grid-cols-2 gap-4 p-4 border rounded">
                  <div>
                    <Label>القيمة</Label>
                    <Input
                      value={stat.value}
                      onChange={(e) => {
                        const newItems = [...data.items];
                        newItems[index].value = e.target.value;
                        setContents(
                          contents.map((c) =>
                            c.section === "stats"
                              ? { ...c, data: { ...c.data, items: newItems } }
                              : c
                          )
                        );
                      }}
                    />
                  </div>
                  <div>
                    <Label>النص</Label>
                    <Input
                      value={stat.label}
                      onChange={(e) => {
                        const newItems = [...data.items];
                        newItems[index].label = e.target.value;
                        setContents(
                          contents.map((c) =>
                            c.section === "stats"
                              ? { ...c, data: { ...c.data, items: newItems } }
                              : c
                          )
                        );
                      }}
                    />
                  </div>
                </div>
              ))}
              <Button onClick={() => updateContent("stats", data)}>
                حفظ التغييرات
              </Button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {data.items.map((stat: any, index: number) => (
                <div key={index} className="p-3 bg-muted rounded">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderFeatures = () => {
    const content = getContent("features");
    if (!content) return null;

    const data = content.data;
    const isEditing = editingSection === "features";

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>المميزات</CardTitle>
            <Button
              size="sm"
              onClick={() => {
                if (isEditing) {
                  setEditingSection(null);
                } else {
                  setEditingSection("features");
                }
              }}
            >
              {isEditing ? "إلغاء" : "تعديل"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>العنوان</Label>
                  <Input
                    value={data.title}
                    onChange={(e) =>
                      setContents(
                        contents.map((c) =>
                          c.section === "features"
                            ? { ...c, data: { ...c.data, title: e.target.value } }
                            : c
                        )
                      )
                    }
                  />
                </div>
                <div>
                  <Label>العنوان الفرعي</Label>
                  <Input
                    value={data.subtitle}
                    onChange={(e) =>
                      setContents(
                        contents.map((c) =>
                          c.section === "features"
                            ? { ...c, data: { ...c.data, subtitle: e.target.value } }
                            : c
                        )
                      )
                    }
                  />
                </div>
              </div>

              {data.items.map((feature: any, index: number) => (
                <div key={index} className="p-4 border rounded space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>الأيقونة</Label>
                      <Input
                        value={feature.icon}
                        onChange={(e) => {
                          const newItems = [...data.items];
                          newItems[index].icon = e.target.value;
                          setContents(
                            contents.map((c) =>
                              c.section === "features"
                                ? { ...c, data: { ...c.data, items: newItems } }
                                : c
                            )
                          );
                        }}
                      />
                    </div>
                    <div>
                      <Label>العنوان</Label>
                      <Input
                        value={feature.title}
                        onChange={(e) => {
                          const newItems = [...data.items];
                          newItems[index].title = e.target.value;
                          setContents(
                            contents.map((c) =>
                              c.section === "features"
                                ? { ...c, data: { ...c.data, items: newItems } }
                                : c
                            )
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>الوصف</Label>
                    <Textarea
                      value={feature.description}
                      onChange={(e) => {
                        const newItems = [...data.items];
                        newItems[index].description = e.target.value;
                        setContents(
                          contents.map((c) =>
                            c.section === "features"
                              ? { ...c, data: { ...c.data, items: newItems } }
                              : c
                          )
                        );
                      }}
                      rows={2}
                    />
                  </div>
                </div>
              ))}
              <Button onClick={() => updateContent("features", data)}>
                حفظ التغييرات
              </Button>
            </>
          ) : (
            <div className="space-y-2">
              <p><strong>العنوان:</strong> {data.title}</p>
              <p><strong>العنوان الفرعي:</strong> {data.subtitle}</p>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {data.items.map((feature: any, index: number) => (
                  <div key={index} className="p-3 bg-muted rounded">
                    <p className="font-semibold">{feature.title}</p>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderBanner = () => {
    const content = getContent("banner");
    if (!content) return null;

    const data = content.data;
    const isEditing = editingSection === "banner";

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>قسم البانر</CardTitle>
            <Button
              size="sm"
              onClick={() => {
                if (isEditing) {
                  setEditingSection(null);
                } else {
                  setEditingSection("banner");
                }
              }}
            >
              {isEditing ? "إلغاء" : "تعديل"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <>
              <div>
                <Label>العنوان</Label>
                <Input
                  value={data.title}
                  onChange={(e) =>
                    setContents(
                      contents.map((c) =>
                        c.section === "banner"
                          ? { ...c, data: { ...c.data, title: e.target.value } }
                          : c
                      )
                    )
                  }
                />
              </div>
              <div>
                <Label>الوصف</Label>
                <Textarea
                  value={data.description}
                  onChange={(e) =>
                    setContents(
                      contents.map((c) =>
                        c.section === "banner"
                          ? { ...c, data: { ...c.data, description: e.target.value } }
                          : c
                      )
                    )
                  }
                  rows={5}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>نص الزر</Label>
                  <Input
                    value={data.buttonText}
                    onChange={(e) =>
                      setContents(
                        contents.map((c) =>
                          c.section === "banner"
                            ? { ...c, data: { ...c.data, buttonText: e.target.value } }
                            : c
                        )
                      )
                    }
                  />
                </div>
                <div>
                  <Label>رابط الزر</Label>
                  <Input
                    value={data.buttonLink}
                    onChange={(e) =>
                      setContents(
                        contents.map((c) =>
                          c.section === "banner"
                            ? { ...c, data: { ...c.data, buttonLink: e.target.value } }
                            : c
                        )
                      )
                    }
                  />
                </div>
              </div>
              <Button onClick={() => updateContent("banner", data)}>
                حفظ التغييرات
              </Button>
            </>
          ) : (
            <div className="space-y-2 text-sm">
              <p><strong>العنوان:</strong> {data.title}</p>
              <p><strong>الوصف:</strong> {data.description}</p>
              <p><strong>نص الزر:</strong> {data.buttonText}</p>
              <p><strong>رابط الزر:</strong> {data.buttonLink}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (contents.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">إدارة البيانات</h1>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">
              لا توجد بيانات حالياً. يرجى التأكد من تطبيق الـ Migration أولاً.
            </p>
            <p className="text-sm text-muted-foreground">
              افتح الملف <code className="bg-muted px-2 py-1 rounded">apply-site-content-migration.html</code> في المتصفح
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">إدارة البيانات</h1>
      </div>

      <div className="space-y-6">
        {renderCompanyInfo()}
        {renderStats()}
        {renderFeatures()}
        {renderBanner()}
      </div>
    </div>
  );
};

export default DashboardContent;
