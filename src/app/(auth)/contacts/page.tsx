'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { contactService } from '@/services/contactService';
import Card from '@/components/ui/Card';
import {
  Contact,
  ContactFilters,
  ContactType,
  ContactPosition,
  CONTACT_TYPE_LABELS,
  CONTACT_POSITION_LABELS,
  ContactSearchResponse,
  ContactStatistics
} from '@/types/contact';
import {
  Search,
  Filter,
  Edit3,
  Trash2,
  Phone,
  Mail,
  Copy,
  Check,
  Plus,
  Download,
  Eye,
  Users,
  Building,
  MapPin,
  TrendingUp,
  UserCheck,
  UserX,
  AlertCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function ContactsPage() {
  const router = useRouter();
  const [searchResponse, setSearchResponse] = useState<ContactSearchResponse>({
    contacts: [],
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });
  const [statistics, setStatistics] = useState<ContactStatistics | null>(null);
  const [loading, setLoading] = useState({
    contacts: true,
    statistics: true
  });
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<ContactFilters>({
    search: '',
    page: 1,
    limit: 20,
  });

  const isAdmin = contactService.isAdmin();

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    setLoading({ contacts: true, statistics: true });
    try {
      const contactsPromise = isAdmin
        ? contactService.getAllContacts(filters)
        : contactService.getContactsForStaff(filters);

      const statsPromise = contactService.getStatistics().catch(() => null);

      const [contactsResponse, statsResponse] = await Promise.all([
        contactsPromise,
        statsPromise
      ]);

      setSearchResponse(contactsResponse);
      setStatistics(statsResponse);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading({ contacts: false, statistics: false });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, contacts: true }));
    setFilters(prev => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = (key: keyof ContactFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(field);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;

    try {
      await contactService.deleteContact(id);
      loadData();
    } catch (error) {
      console.error('Failed to delete contact:', error);
    }
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleExport = async (format: 'csv' | 'xlsx' = 'csv') => {
    try {
      const blob = await contactService.exportContacts(format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contacts.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to export contacts:', error);
    }
  };

  const StatisticsSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="border border-gray-200 px-4">
          <div className="flex flex-row items-center justify-start space-x-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
            <div className="flex flex-col items-start justify-center mt-2 space-y-2">
              <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
              <div className="w-16 h-6 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const ContactsTableSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />
      ))}
    </div>
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-app-foreground mb-2">Contact Directory</h1>
          <p className="text-app-foreground">Manage healthcare organization contacts</p>
        </div>
        <div className="flex flex-wrap gap-3 mt-4 sm:mt-0">
          <button
            onClick={() => router.push('/contacts/suggestions')}
            className="px-4 py-2 bg-app-foreground text-white rounded-lg hover:bg-app-foreground-light transition-colors duration-200 flex items-center space-x-2"
          >
            <Eye className="w-4 h-4" />
            <span>View Suggestions</span>
          </button>
          {!isAdmin && (
            <button
              onClick={() => router.push('/contacts/suggest-new')}
              className="px-4 py-2 bg-app-foreground text-white rounded-lg hover:bg-app-foreground-light transition-all duration-200 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Suggest Contact</span>
            </button>
          )}
          {isAdmin && (
            <>
              <button
                onClick={() => handleExport('csv')}
                className="px-4 py-2 bg-app-foreground text-white rounded-lg hover:bg-app-foreground-light transition-colors duration-200 flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button
                onClick={() => router.push('/contacts/new')}
                className="px-4 py-2 bg-app-foreground text-white rounded-lg hover:bg-app-foreground-light transition-all duration-200 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Contact</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      {loading.statistics ? (
        <StatisticsSkeleton />
      ) : statistics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border border-app-foreground px-4">
            <div className="flex flex-row items-center justify-start space-x-4">
              <div className="w-12 h-12 bg-app-foreground rounded-full flex items-center justify-center">
                <span className="flex items-center justify-center w-12 h-12 rounded-full bg-app-foreground">
                  <Users className="w-6 h-6 text-white" />
                </span>
              </div>
              <div className="flex flex-col items-start justify-center mt-2">
                <p className="text-sm font-medium text-app-foreground">Total Contacts</p>
                <p className="text-2xl font-bold text-app-foreground">{statistics.totalContacts}</p>
              </div>
            </div>
          </Card>

          <Card className="border border-green-400 bg-green-50 px-4">
            <div className="flex flex-row items-center justify-start space-x-4">
              <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                <span className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
                  <UserCheck className="w-6 h-6 text-green-700" />
                </span>
              </div>
              <div className="flex flex-col items-start justify-center mt-2">
                <p className="text-sm font-medium text-green-700">Active Contacts</p>
                <p className="text-2xl font-bold text-green-700">{statistics.activeContacts}</p>
              </div>
            </div>
          </Card>

          <Card className="border border-red-400 bg-red-50 px-4">
            <div className="flex flex-row items-center justify-start space-x-4">
              <div className="w-12 h-12 bg-red-200 rounded-full flex items-center justify-center">
                <span className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100">
                  <UserX className="w-6 h-6 text-red-700" />
                </span>
              </div>
              <div className="flex flex-col items-start justify-center mt-2">
                <p className="text-sm font-medium text-red-700">Inactive Contacts</p>
                <p className="text-2xl font-bold text-red-700">{statistics.inactiveContacts}</p>
              </div>
            </div>
          </Card>

          <Card className="border border-yellow-400 bg-yellow-50 px-4">
            <div className="flex flex-row items-center justify-start space-x-4">
              <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center">
                <span className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100">
                  <AlertCircle className="w-6 h-6 text-yellow-700" />
                </span>
              </div>
              <div className="flex flex-col items-start justify-center mt-2">
                <p className="text-sm font-medium text-yellow-700">Pending Suggestions</p>
                <p className="text-2xl font-bold text-yellow-700">{statistics.pendingSuggestions}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Search and Filters */}
      <Card>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search by institution, individual name, or email..."
                className="w-full pl-10 pr-4 py-3 bg-white/70 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-app-foreground text-white rounded-lg hover:bg-app-foreground-light transition-colors duration-200 flex items-center space-x-2"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-app-foreground text-white rounded-lg hover:bg-app-foreground-light transition-all duration-200"
            >
              Search
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Organization Type</label>
                  <select
                    value={filters.organizationType || ''}
                    onChange={(e) => handleFilterChange('organizationType', e.target.value || undefined)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Types</option>
                    {Object.entries(CONTACT_TYPE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                  <select
                    value={filters.position || ''}
                    onChange={(e) => handleFilterChange('position', e.target.value || undefined)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Positions</option>
                    {Object.entries(CONTACT_POSITION_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={filters.isActive?.toString() || ''}
                    onChange={(e) => handleFilterChange('isActive', e.target.value === '' ? undefined : e.target.value === 'true')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Status</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </form>
      </Card>

      {/* Contacts Grid - Mobile and Desktop Responsive */}
      <div className="space-y-6">
        {loading.contacts ? (
          <ContactsTableSkeleton />
        ) : (
          <div className="hidden lg:block">
            <Card>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr className="border-b border-gray-100">
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Institution & Individual</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Organization & Position</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Contact Information</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Location</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {searchResponse.contacts.map((contact) => (
                      <tr key={contact.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{contact.instituteName}</div>
                          <div className="text-sm text-gray-500">{contact.individualName}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-gray-900">{CONTACT_TYPE_LABELS[contact.organizationType]}</div>
                          <div className="text-sm text-gray-500">{CONTACT_POSITION_LABELS[contact.position]}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">{contact.phoneNumber}</span>
                              <button
                                onClick={() => handleCopy(contact.phoneNumber, `phone-${contact.id}`)}
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                              >
                                {copySuccess === `phone-${contact.id}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">{contact.emailAddress}</span>
                              <button
                                onClick={() => handleCopy(contact.emailAddress, `email-${contact.id}`)}
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                              >
                                {copySuccess === `email-${contact.id}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-gray-900">{contact.region}</div>
                          <div className="text-sm text-gray-500">{contact.location}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${contact.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                            }`}>
                            {contact.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            {isAdmin && (
                              <>
                                <button
                                  onClick={() => router.push(`/contacts/${contact.id}/edit`)}
                                  className="text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(contact.id)}
                                  className="text-gray-500 hover:text-red-600 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => router.push(`/contacts/${contact.id}/suggest`)}
                              className="text-gray-500 hover:text-gray-700 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {loading.contacts ? (
            <ContactsTableSkeleton />
          ) : searchResponse.contacts.map((contact) => (
            <Card key={contact.id}>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{contact.instituteName}</h3>
                    <p className="text-sm text-gray-600">{contact.individualName}</p>
                    <p className="text-sm text-gray-500 mt-1">{CONTACT_TYPE_LABELS[contact.organizationType]} · {CONTACT_POSITION_LABELS[contact.position]}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${contact.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                    }`}>
                    {contact.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm flex-1">{contact.phoneNumber}</span>
                    <button
                      onClick={() => handleCopy(contact.phoneNumber, `phone-${contact.id}`)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {copySuccess === `phone-${contact.id}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm flex-1">{contact.emailAddress}</span>
                    <button
                      onClick={() => handleCopy(contact.emailAddress, `email-${contact.id}`)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {copySuccess === `email-${contact.id}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{contact.region}, {contact.location}</span>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-3 border-t border-gray-100">
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => router.push(`/contacts/${contact.id}/edit`)}
                        className="px-3 py-1.5 text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-sm flex items-center space-x-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(contact.id)}
                        className="px-3 py-1.5 text-gray-600 bg-gray-50 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors text-sm flex items-center space-x-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => router.push(`/contacts/${contact.id}/suggest`)}
                    className="px-3 py-1.5 text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-sm flex items-center space-x-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Suggest</span>
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Pagination */}
      {searchResponse.totalPages > 1 && (
        <Card>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((searchResponse.page - 1) * searchResponse.limit) + 1} to {Math.min(searchResponse.page * searchResponse.limit, searchResponse.total)} of {searchResponse.total} results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(searchResponse.page - 1)}
                disabled={searchResponse.page === 1}
                className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, searchResponse.totalPages) }, (_, i) => {
                  let page;
                  if (searchResponse.totalPages <= 5) {
                    page = i + 1;
                  } else if (searchResponse.page <= 3) {
                    page = i + 1;
                  } else if (searchResponse.page >= searchResponse.totalPages - 2) {
                    page = searchResponse.totalPages - 4 + i;
                  } else {
                    page = searchResponse.page - 2 + i;
                  }

                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 text-sm rounded-lg transition-colors ${page === searchResponse.page
                        ? 'bg-gray-600 text-white'
                        : 'bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(searchResponse.page + 1)}
                disabled={searchResponse.page === searchResponse.totalPages}
                className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
} 