
import React, { useState, useEffect } from 'react';
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
import { Image, Upload } from 'lucide-react';

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
  // Update this to receive ProcessingType[] compatible values
  compatibleOperations: z.array(z.string()).transform(operations => 
    operations as unknown as ProcessingType[]
  ).optional(),
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
  defaultType?: MaterialType | string;
}

export const MaterialForm: React.FC<MaterialFormProps> = ({
  material,
  onSubmit,
  onCancel,
  defaultType = 'PAL'
}) => {
  const { t } = useTranslation();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Default values for the form
  const defaultValues: Partial<FormValues> = {
    code: material?.code || '',
    name: material?.name || '',
    type: material?.type || defaultType as MaterialType,
    thickness: material?.thickness || 18,
    paintable: material?.paintable || false,
    cantable: material?.cantable || false,
    manufacturer: material?.manufacturer || '',
    pricePerSqm: material?.pricePerSqm || 0,
    supplier: material?.supplier || 'Egger',
    availability: material?.availability || true,
    textureUrl: material?.textureUrl || '',
    // Fixed: Properly cast compatibleOperations to match the expected type
    compatibleOperations: (material?.compatibleOperations || []) as unknown as string[],
  };

  // Set image preview if material has a textureUrl
  useEffect(() => {
    if (material?.textureUrl) {
      setImagePreview(material.textureUrl);
    }
  }, [material]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = (values: FormValues) => {
    // Make sure to include the image URL
    if (imagePreview) {
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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 text-white">
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
                <FormMessage className="text-red-400" />
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
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          {/* Image upload field with improved UI */}
          <FormItem className="col-span-2">
            <FormLabel className="text-white">Material Image</FormLabel>
            <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1 w-full">
                <label 
                  htmlFor="image-upload" 
                  className="flex items-center justify-center w-full h-24 px-4 transition bg-gray-700 border-2 border-gray-600 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-500 focus:outline-none"
                >
                  <span className="flex items-center space-x-2">
                    <Upload className="w-6 h-6 text-gray-300" />
                    <span className="text-sm text-gray-300">
                      {t('common.upload')} {t('materials.form.image')}
                    </span>
                  </span>
                  <input 
                    id="image-upload" 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                <FormDescription className="mt-1 text-sm text-gray-400">
                  {t('materials.form.imageDescription') || "Upload an image for this material"}
                </FormDescription>
              </div>
              <div className="w-full md:w-1/3 h-32 bg-gray-800 border border-gray-600 rounded-md overflow-hidden">
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-900">
                    <Image className="h-10 w-10 text-gray-600" />
                  </div>
                )}
              </div>
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
                  <SelectContent className="bg-gray-800 text-white border-gray-700">
                    <SelectItem value="PAL" className="text-white hover:bg-gray-700">PAL</SelectItem>
                    <SelectItem value="MDF" className="text-white hover:bg-gray-700">MDF</SelectItem>
                    <SelectItem value="MDF-AGT" className="text-white hover:bg-gray-700">MDF-AGT</SelectItem>
                    <SelectItem value="PFL" className="text-white hover:bg-gray-700">PFL</SelectItem>
                    <SelectItem value="GLASS" className="text-white hover:bg-gray-700">{t('materials.glass')}</SelectItem>
                    <SelectItem value="COUNTERTOP" className="text-white hover:bg-gray-700">{t('materials.countertops')}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="thickness"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">{t('materials.form.thickness')}</FormLabel>
                <FormControl>
                  <Input type="number" {...field} className="bg-gray-700 text-white border-gray-600" />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="manufacturer"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">{t('materials.form.manufacturer')}</FormLabel>
                <FormControl>
                  <Input placeholder="Egger" {...field} className="bg-gray-700 text-white border-gray-600" />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="supplier"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">{t('materials.form.supplier')}</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-gray-700 text-white border-gray-600">
                      <SelectValue placeholder={t('materials.form.selectSupplier')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-gray-800 text-white border-gray-700">
                    <SelectItem value="Egger" className="text-white hover:bg-gray-700">Egger</SelectItem>
                    <SelectItem value="AGT" className="text-white hover:bg-gray-700">AGT</SelectItem>
                    <SelectItem value="SticlaExpert" className="text-white hover:bg-gray-700">SticlaExpert</SelectItem>
                    <SelectItem value="Hafele" className="text-white hover:bg-gray-700">Hafele</SelectItem>
                    <SelectItem value="Blum" className="text-white hover:bg-gray-700">Blum</SelectItem>
                    <SelectItem value="GTV" className="text-white hover:bg-gray-700">GTV</SelectItem>
                    <SelectItem value="Other" className="text-white hover:bg-gray-700">{t('materials.form.other')}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pricePerSqm"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">{t('materials.form.pricePerSqm')}</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} className="bg-gray-700 text-white border-gray-600" />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <div className="col-span-2 space-y-4">
            <FormField
              control={form.control}
              name="paintable"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-gray-700 p-4 bg-gray-800">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-blue-600"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-white">{t('materials.form.paintable')}</FormLabel>
                    <FormDescription className="text-gray-400">
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
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-gray-700 p-4 bg-gray-800">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-green-600"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-white">{t('materials.form.cantable')}</FormLabel>
                    <FormDescription className="text-gray-400">
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
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-gray-700 p-4 bg-gray-800">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-green-600"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-white">{t('materials.form.inStock')}</FormLabel>
                    <FormDescription className="text-gray-400">
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
