import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MaterialType, ProcessingType } from '@/types';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/contexts/TranslationContext';

// Define form schema using Zod
const formSchema = z.object({
  code: z.string().min(2, { message: "Code must be at least 2 characters" }),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  type: z.enum(["PAL", "MDF", "MDF-AGT", "PFL", "GLASS", "COUNTERTOP"]),
  thickness: z.coerce.number().min(1, { message: "Thickness must be at least 1mm" }),
  paintable: z.boolean().default(false),
  cantable: z.boolean().default(false),
  manufacturer: z.string().min(1, { message: "Manufacturer is required" }),
  pricePerSqm: z.coerce.number().min(0, { message: "Price must be a positive number" }),
  supplier: z.enum(["Egger", "AGT", "SticlaExpert", "Hafele", "Blum", "GTV", "Other"]),
  availability: z.boolean().default(true),
  textureUrl: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface MaterialFormProps {
  material?: {
    id: string;
    code: string;
    name: string;
    type: MaterialType;
    thickness: number;
    paintable: boolean;
    cantable: boolean;
    manufacturer: string;
    pricePerSqm: number;
    supplier: 'Egger' | 'AGT' | 'SticlaExpert' | 'Hafele' | 'Blum' | 'GTV' | 'Other';
    availability: boolean;
    compatibleOperations?: ProcessingType[];
    textureUrl?: string;
    imageUrl?: string;
  };
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
}

export const MaterialForm: React.FC<MaterialFormProps> = ({
  material,
  onSubmit,
  onCancel
}) => {
  const { t } = useTranslation();
  const [imagePreview, setImagePreview] = useState<string | null>(material?.textureUrl || null);
  
  // Default values for the form
  const defaultValues: Partial<FormValues> = {
    code: material?.code || '',
    name: material?.name || '',
    type: material?.type || 'PAL',
    thickness: material?.thickness || 18,
    paintable: material?.paintable || false,
    cantable: material?.cantable || false,
    manufacturer: material?.manufacturer || '',
    pricePerSqm: material?.pricePerSqm || 0,
    supplier: material?.supplier || 'Egger',
    availability: material?.availability || true,
    textureUrl: material?.textureUrl || '',
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = (values: FormValues) => {
    // Make sure to include the image URL
    if (imagePreview && !values.textureUrl) {
      values.textureUrl = imagePreview;
    }
    onSubmit(values);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload this to a server
      // For now, we'll create a local URL for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        form.setValue('textureUrl', result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">{t('materials.form.code')}</FormLabel>
                <FormControl>
                  <Input placeholder="PAL-W980-ST2-18" {...field} className="bg-gray-700 text-white border-gray-600" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">{t('materials.form.name')}</FormLabel>
                <FormControl>
                  <Input placeholder="Alb W980 ST2" {...field} className="bg-gray-700 text-white border-gray-600" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image upload field */}
          <FormItem className="col-span-2">
            <FormLabel className="text-white">Material Image</FormLabel>
            <div className="flex items-start space-x-4">
              <div className="flex-1">
                <Input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="bg-gray-700 text-white border-gray-600" 
                />
                <FormDescription className="text-gray-400">
                  Upload an image for this material
                </FormDescription>
              </div>
              {imagePreview && (
                <div className="w-24 h-24 bg-gray-800 border border-gray-600 overflow-hidden">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </FormItem>

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">{t('materials.form.type')}</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-gray-700 text-white border-gray-600">
                      <SelectValue placeholder={t('materials.form.selectType')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="PAL">PAL</SelectItem>
                    <SelectItem value="MDF">MDF</SelectItem>
                    <SelectItem value="MDF-AGT">MDF-AGT</SelectItem>
                    <SelectItem value="PFL">PFL</SelectItem>
                    <SelectItem value="GLASS">{t('materials.glass')}</SelectItem>
                    <SelectItem value="COUNTERTOP">{t('materials.countertops')}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="thickness"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('materials.form.thickness')}</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="manufacturer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('materials.form.manufacturer')}</FormLabel>
                <FormControl>
                  <Input placeholder="Egger" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="supplier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('materials.form.supplier')}</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('materials.form.selectSupplier')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Egger">Egger</SelectItem>
                    <SelectItem value="AGT">AGT</SelectItem>
                    <SelectItem value="SticlaExpert">SticlaExpert</SelectItem>
                    <SelectItem value="Hafele">Hafele</SelectItem>
                    <SelectItem value="Blum">Blum</SelectItem>
                    <SelectItem value="GTV">GTV</SelectItem>
                    <SelectItem value="Other">{t('materials.form.other')}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pricePerSqm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('materials.form.pricePerSqm')}</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="paintable"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>{t('materials.form.paintable')}</FormLabel>
                    <FormDescription>
                      {t('materials.form.paintableDesc')}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cantable"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>{t('materials.form.cantable')}</FormLabel>
                    <FormDescription>
                      {t('materials.form.cantableDesc')}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="availability"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>{t('materials.form.inStock')}</FormLabel>
                    <FormDescription>
                      {t('materials.form.inStockDesc')}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel} className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600">
            {t('common.cancel')}
          </Button>
          <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-500">
            {material ? t('materials.form.updateMaterial') : t('materials.form.createMaterial')}
          </Button>
        </div>
      </form>
    </Form>
  );
};
