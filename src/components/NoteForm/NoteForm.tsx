
import React from 'react';
import type { FormikHelpers } from 'formik';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import css from './NoteForm.module.css';
import type{ NewNote } from '../../types/note';
import { createNote } from '../../services/noteService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface Props {
  onCancel: () => void;
  onSuccess: () => void;
}

const tagOptions = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'] as const;

const validationSchema = Yup.object().shape({
  title: Yup.string().min(3, 'Min 3').max(50, 'Max 50').required('Required'),
  content: Yup.string().max(500, 'Max 500'),
  tag: Yup.mixed().oneOf(tagOptions as readonly string[]).required('Required'),
});

const NoteForm: React.FC<Props> = ({ onCancel, onSuccess }) => {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: NewNote) => createNote(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notes'] });
      onSuccess();
    },
  });

  const initialValues: NewNote = { title: '', content: '', tag: 'Todo' };

  const handleSubmit = async (values: NewNote, helpers: FormikHelpers<NewNote>) => {
    try {
      await mutation.mutateAsync(values);
    } catch (err) {
      console.error(err);
    } finally {
      helpers.setSubmitting(false);
    }
  };

  return (
    <div className={css.wrapper}>
      <h2 className={css.header}>Create note</h2>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form className={css.form}>
            <div className={css.formGroup}>
              <label htmlFor="title">Title</label>
              <Field id="title" name="title" className={css.input} />
              <span className={css.error}><ErrorMessage name="title" /></span>
            </div>

            <div className={css.formGroup}>
              <label htmlFor="content">Content</label>
              <Field as="textarea" id="content" name="content" rows={8} className={css.textarea} />
              <span className={css.error}><ErrorMessage name="content" /></span>
            </div>

            <div className={css.formGroup}>
              <label htmlFor="tag">Tag</label>
              <Field as="select" id="tag" name="tag" className={css.select}>
                {tagOptions.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </Field>
              <span className={css.error}><ErrorMessage name="tag" /></span>
            </div>

            <div className={css.actions}>
              <button type="button" className={css.cancelButton} onClick={onCancel} disabled={isSubmitting}>
                Cancel
              </button>
              <button type="submit" className={css.submitButton} disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create note'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default NoteForm;
