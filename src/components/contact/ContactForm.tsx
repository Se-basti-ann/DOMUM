import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSupabase } from '../../contexts/SupabaseContext';
import { ContactFormValues } from '../../types';

const ContactForm = () => {
  const supabase = useSupabase();
  const [formValues, setFormValues] = useState<ContactFormValues>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({
    type: null,
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      // Submit to Supabase
      const { error } = await supabase.from('contact_messages').insert([
        {
          name: formValues.name,
          email: formValues.email,
          phone: formValues.phone,
          subject: formValues.subject,
          message: formValues.message,
          read: false,
        },
      ]);

      if (error) throw error;

      // Reset form
      setFormValues({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });

      setSubmitStatus({
        type: 'success',
        message: '¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.',
      });
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Hubo un problema al enviar tu mensaje. Por favor, inténtalo de nuevo.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
      {submitStatus.type && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 mb-6 rounded-md ${
            submitStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}
        >
          {submitStatus.message}
        </motion.div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-primary-700 mb-1">
              Nombre Completo *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formValues.name}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-primary-700 mb-1">
              Correo Electrónico *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formValues.email}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-primary-700 mb-1">
              Teléfono
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formValues.phone}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-primary-700 mb-1">
              Asunto *
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              value={formValues.subject}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="message" className="block text-sm font-medium text-primary-700 mb-1">
            Mensaje *
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={formValues.message}
            onChange={handleChange}
            className="input-field resize-none"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="button-primary py-3 px-8 w-full md:w-auto"
        >
          {isSubmitting ? (
            <span className="inline-block h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
          ) : (
            'Enviar Mensaje'
          )}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;